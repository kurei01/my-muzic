import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import {
  changeAudio,
  moveAudio,
  pause,
  selectAudio,
} from "../misc/audioController";
import { convertTime } from "../misc/helper";
import Screen from "../components/Screen";

const { width } = Dimensions.get("window");

const Player = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);

  const { soundObj, playbackPosition, playbackDuration, currentAudio } =
    context;

  const calculateSeebBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }

    return 0;
  };

  const renderCurrentTime = () => {
    if (!soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

  const handlePlayPause = async () => {
    await selectAudio(currentAudio, context);
  };

  const handleNext = async () => {
    await changeAudio(context, "next");
  };

  const handlePrevious = async () => {
    await changeAudio(context, "previous");
  };

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  if (!currentAudio) return null;

  return (
    <Screen>
      <View style={styles.horizontalContainer}>
        <View tw="flex-row">
          {context.isPlayListRunning && (
            <>
              <Text tw="font-bold">From Playlist: </Text>
              <Text>{context.activePlayList.title}</Text>
            </>
          )}
        </View>
        <Text tw="text-right text-sm" style={styles.audioCount}>
          {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
        </Text>
      </View>
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
        <View style={styles.horizontalContainer}>
          <Text>{currentPosition ? currentPosition : renderCurrentTime()}</Text>
          <Text>{convertTime(currentAudio.duration)}</Text>
        </View>
        <Slider
          style={{ width: width, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={calculateSeebBar()}
          minimumTrackTintColor={color.FONT_MEDIUM}
          maximumTrackTintColor={color.ACTIVE_BG}
          onValueChange={(value) =>
            setCurrentPosition(convertTime(value * currentAudio.duration))
          }
          onSlidingStart={async () => {
            if (!context.isPlaying) return;

            try {
              await pause(context.playbackObj);
            } catch (error) {
              console.log("error inside onSlidingStart callback", error);
            }
          }}
          onSlidingComplete={async (value) => {
            await moveAudio(context, value);
            setCurrentPosition(0);
          }}
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
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
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
