import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext } from "react";
import color from "../misc/color";
import { AudioContext } from "../context/AudioProvider";
import AudioItem from "../components/AudioItem";
import { selectAudio } from "../misc/audioController";

const PlayListDetail = (props) => {
  const context = useContext(AudioContext);
  const playList = props.route.params

  const playAudio = async (audio) => {
    await selectAudio(audio, context, {
      activePlayList: playList,
      isPlayListRunning: true,
    });
  };
  return (
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{playList.title}</Text>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={playList.audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View tw="pb-3">
              <AudioItem
                title={item.filename}
                duration={item.duration}
                isPlaying={context.isPlaying}
                activeListItem={item.id === context.currentAudio.id}
                onAudioPress={() => playAudio(item)}
              />
            </View>
          )}
        />
      </View>
  );
};

export default PlayListDetail;
const styles = StyleSheet.create({
  modalContainer: {
    alignSelf: "center",
  },
  listContainer: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: "bold",
    color: color.ACTIVE_BG,
  },
});
