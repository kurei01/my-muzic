import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useContext, useEffect } from "react";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import { pause, play, playNext, resume } from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";

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

  const handlePlayPause = async () => {
    const {
      playbackObj,
      soundObj,
      currentAudio,
      updateState,
      onPlayBackStatusUpdate,
    } = context;
    //play
    if (soundObj === null) {
      const status = await play(playbackObj, currentAudio.uri);
      playbackObj.setOnPlaybackStatusUpdate(onPlayBackStatusUpdate);
      return updateState(context, {
        soundObj: status,
        isPlaying: status.isPlaying,
      });
    }
    //pause
    if (soundObj && soundObj.isPlaying) {
      const status = await pause(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: status.isPlaying,
      });
    }
    //resume
    if (soundObj && !soundObj.isPlaying) {
      const status = await resume(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: status.isPlaying,
      });
    }
  };

  const handleNext = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isLastAudio =
      context.currentAudioIndex + 1 === context.totalAudioCount;
    let audio = context.audioFiles[context.currentAudioIndex + 1];
    let index;
    let status;

    if (!isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await play(context.playbackObj, audio.uri);
    }

    if (isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await playNext(context.playbackObj, audio.uri);
    }

    if (isLastAudio) {
      index = 0;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  };

  const handlePrevious = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isFirstAudio = context.currentAudioIndex <= 0;
    let audio = context.audioFiles[context.currentAudioIndex - 1];
    let index;
    let status;

    if (!isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await play(context.playbackObj, audio.uri);
    }

    if (isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await playNext(context.playbackObj, audio.uri);
    }

    if (isFirstAudio) {
      index = context.totalAudioCount - 1;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  };

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  return (
    <View tw="flex-1">
      <Text tw="text-right text-sm p-4" style={styles.audioCount}>
        {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
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
          {context.currentAudio?.filename}
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
          <PlayerButton iconType="PREV" onPress={handlePrevious} />
          <PlayerButton
            tw="px-6"
            iconType={context.isPlaying ? "PAUSE" : "PLAY"}
            onPress={handlePlayPause}
          />
          <PlayerButton iconType="NEXT" onPress={handleNext} />
        </View>
      </View>
    </View>
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
