import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import color from "../misc/color";
import PlayListInputModal from "../components/PlayListInputModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioContext } from "../context/AudioProvider";

const PlayList = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const audios = [];
      addToPlayList && audios.push(addToPlayList);
      const newList = {
        id: Date.now(),
        title: playListName,
        audios,
      };

      const updateList = [...playList, newList];
      updateState(context, { addToPlayList: null, playList: updateList });
      await AsyncStorage.setItem("playlist", JSON.stringify(updateList));
    }
    setModalVisible(false);
  };

  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: "My favourite",
        audios: [],
      };
      const newPlayList = [...playList, defaultPlayList];
      updateState(context, { playList: newPlayList });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify(newPlayList)
      );
    }

    updateState(context, { playList: JSON.parse(result) });
  };

  useEffect(() => {
    !playList.length && renderPlayList();
  }, []);

  return (
    <ScrollView tw="p-5">
      <TouchableOpacity style={styles.playListBanner}>
        <Text>My favorite</Text>
        <Text style={styles.audioCount}>0 songs</Text>
      </TouchableOpacity>

      {playList?.map((item) => (
        <TouchableOpacity
          key={item.id.toString()}
          style={styles.playListBanner}
        >
          <Text>{item.title}</Text>
          <Text style={styles.audioCount}>
            {item.audios.length > 1
              ? `${item.audios.length} Songs`
              : `${item.audios.length} Song`}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.playListBtn}>+ Add New Playlist</Text>
      </TouchableOpacity>

      <PlayListInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={createPlayList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  playListBanner: {
    padding: 5,
    backgroundColor: color.BANNER,
    borderRadius: 5,
    marginBottom: 15,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.5,
    fontSize: 14,
  },
  playListBtn: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
});

export default PlayList;
