import { Dimensions, Text, View } from "react-native";
import React, { Component } from "react";
import { AudioContext } from "../context/AudioProvider";
import { LayoutProvider, RecyclerListView } from "recyclerlistview";
import AudioItem from "../components/AudioItem";

export class AudioList extends Component {
  static contextType = AudioContext;

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

  rowRender = (type, item, index, extendStated) => {
    return <AudioItem title={item.filename} duration={item.duration} />;
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider }) => {
          return (
            <View tw="flex-1">
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRender}
              />
            </View>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

export default AudioList;
