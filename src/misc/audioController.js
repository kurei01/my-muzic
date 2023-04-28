import { storeAudioForNextOpening } from "./helper";

//playaudio
export const play = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync(
      { uri },
      { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
    );
  } catch (error) {
    console.log("error inside play helper method", error.message);
  }
};
//pause audio
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.pauseAsync();
  } catch (error) {
    console.log("error inside pause helper method", error.message);
  }
};
//resume audio
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error inside resume helper method", error.message);
  }
};
// select another audio
export const playNext = async (playbackObj, uri) => {
  await playbackObj.stopAsync().catch((err) => {
    console.log("error inside playNext stopAsync method", err.message);
  });

  await playbackObj.unloadAsync().catch((err) => {
    console.log("error inside playNext unLoadAsync method", err.message);
  });

  return await play(playbackObj, uri).catch((err) => {
    console.log("error inside playNext method", err.message);
  });
};

export const selectAudio = async (audio, context, playListInfo = {}) => {
  const {
    playbackObj,
    soundObj,
    currentAudio,
    updateState,
    audioFiles,
    onPlayBackStatusUpdate,
  } = context;
  try {
    //playing audio fisrttime
    if (soundObj === null) {
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: status.isPlaying,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      playbackObj.setOnPlaybackStatusUpdate(onPlayBackStatusUpdate);
      return await storeAudioForNextOpening(audio, index);
    }
    //pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: status.isPlaying,
        playbackPosition: status.positionMillis,
      });
    }
    //resume audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: status.isPlaying,
      });
    }
    //selected another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: status.isPlaying,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      return await storeAudioForNextOpening(audio, index);
    }
  } catch (error) {
    console.log("error inside select audio method", error.message);
  }
};

const selectAudioFromPlayList = async (context, select) => {
  const { activePlayList, currentAudio, audioFiles, playbackObj, updateState } =
    context;
  let audio;
  let defaultIndex;
  let nextIndex;

  const indexOnPlayList = activePlayList.audios.findIndex(
    ({ id }) => id === currentAudio.id
  );

  if (select === "next") {
    nextIndex = indexOnPlayList + 1;
    defaultIndex = 0;
  }

  if (select === "previous") {
    nextIndex = indexOnPlayList - 1;
    defaultIndex = activePlayList.audios.length - 1;
  }
  audio = activePlayList.audios[nextIndex];

  if (!audio) audio = activePlayList.audios[defaultIndex];

  const indexOnAllList = audioFiles.findIndex(({ id }) => id === audio.id);

  const status = await playNext(playbackObj, audio.uri);
  return updateState(context, {
    soundObj: status,
    isPlaying: true,
    currentAudio: audio,
    currentAudioIndex: indexOnAllList,
  });
};

export const changeAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFiles,
    updateState,
    isPlayListRunning,
  } = context;

  if (isPlayListRunning) return selectAudioFromPlayList(context, select);

  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
    const isFirstAudio = currentAudioIndex <= 0;
    let audio;
    let index;
    let status;

    //for next
    if (select === "next") {
      audio = audioFiles[currentAudioIndex + 1];
      if (!isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await play(playbackObj, audio.uri);
      }

      if (isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isLastAudio) {
        index = 0;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    //for previous
    if (select === "previous") {
      audio = audioFiles[currentAudioIndex - 1];
      if (!isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await play(playbackObj, audio.uri);
      }

      if (isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isFirstAudio) {
        index = totalAudioCount - 1;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  } catch (error) {
    console.log("error inside changeAudio method", error.message);
  }
};

export const moveAudio = async (context, value) => {
  const { soundObj, isPlaying, playbackObj, updateState } = context;
  if (soundObj === null || !isPlaying) return;

  try {
    await playbackObj.setPositionAsync(
      Math.floor(soundObj.durationMillis * value)
    );
    const status = await resume(playbackObj);
    updateState(context, {
      soundObj: status,
      playbackPosition: status.positionMillis,
      isPlaying: status.isPlaying,
    });
  } catch (error) {
    console.log("error inside onSlidingComplete callback", error);
  }
};
