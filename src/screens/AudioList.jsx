import { Dimensions } from "react-native";
import React, { Component } from "react";
import { AudioContext } from "../context/AudioProvider";
import { LayoutProvider, RecyclerListView } from "recyclerlistview";
import AudioItem from "../components/AudioItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import { pause, play, playNext, resume } from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };
    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  handleAudioPress = async (audio) => {
    const { playbackObj, soundObj, currentAudio, updateState, audioFiles } =
      this.context;
    //playing audio fisrttime
    if (soundObj === null) {
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      updateState(this.context, {
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: status.isPlaying,
        currentAudioIndex: index,
      });
      playbackObj.setOnPlaybackStatusUpdate(
        this.context.onPlayBackStatusUpdate
      );
      return await storeAudioForNextOpening(audio, index);
    }
    //pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: status.isPlaying,
      });
    }
    //resume audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: status.isPlaying,
      });
    }
    //selected another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      updateState(this.context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: status.isPlaying,
        currentAudioIndex: index,
      });
      return await storeAudioForNextOpening(audio, index);
    }
  };

  rowRender = (type, item, index, extendStated) => {
    return (
      <AudioItem
        title={item.filename}
        isPlaying={extendStated.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRender}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                onPlayPress={() => console.log("playing audio")}
                onPlayListPress={() => {
                  this.context.updateState(this.context, {
                    addToPlayList: this.currentItem,
                  });
                  this.props.navigation.navigate("PlayList");
                  this.setState({ ...this.state, optionModalVisible: false });
                }}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                visible={this.state.optionModalVisible}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

export default AudioList;
