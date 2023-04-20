import { Alert, Text, View } from "react-native";
import React, { Component, createContext } from "react";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";

export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
    };
    this.totalAudioCount = 0;
  }

  permissionAllert = () => {
    Alert.alert("Permission Required", "This app needs to read audio files!", [
      {
        text: "I'm ready",
        onPress: () => this.getPermission(),
      },
      {
        text: "cancle",
        onPress: () => this.permissionAllert(),
      },
    ]);
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    console.log(media);
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;

    media.assets = media.assets.filter((file) => file.duration > 3); 
    console.log(media);
    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      //get all audio file
      this.getAudioFiles();
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionError: true });
    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        //display alert that user must allow this permission to work this app
        this.permissionAllert();
      }

      if (status === "granted") {
        //get all the audio files
        this.getAudioFiles();
      }

      if (status === "denied" && !canAskAgain) {
        //display some error to the user
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  componentDidMount() {
    this.getPermission();
  }

  render() {
    const { audioFiles, dataProvider, permissionError } = this.state;
    if (permissionError)
      return (
        <View tw="flex-1 items-center justify-center">
          <Text tw="text-2xl text-red-500 text-center">
            It look like you haven't accept the permission
          </Text>
        </View>
      );
    return (
      <AudioContext.Provider value={{ audioFiles, dataProvider }}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
