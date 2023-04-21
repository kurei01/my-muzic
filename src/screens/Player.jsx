import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useContext } from "react";
import Screen from "../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";

const { width } = Dimensions.get("window");

const Player = () => {
  const context = useContext(AudioContext);

  const { playbackPosition, playbackDuration } = context;

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };
  return (
    <Screen>
      <View tw="flex-1">
        <Text tw="text-right text-sm p-4" style={styles.audioCount}>
          {`${context.currentAudioIndex} / ${context.totalAudioCount}`}
        </Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle} tw="text-base p-4">
            {context.currentAudio.filename}
          </Text>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
          />
          <View style={styles.audioController}>
            <PlayerButton iconType="PREV" />
            <PlayerButton
              tw="px-6"
              iconType={context.isPlaying ? "PAUSE" : "PLAY"}
              onPress={() => console.log("play")}
            />
            <PlayerButton iconType="NEXT" />
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  audioCount: {
    color: color.FONT_LIGHT,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioTitle: {
    color: color.FONT,
  },
  audioController: {
    width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 20,
  },
});

export default Player;
