import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import color from "../misc/color";
import AudioItem from "./AudioItem";

const PlayListDetail = ({ visible, playList, onClose }) => {
  return (
    <Modal
      onRequestClose={onClose}
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{playList.title}</Text>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={playList.audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View tw="pb-3">
              <AudioItem title={item.filename} duration={item.duration} />
            </View>
          )}
        />
      </View>
      <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
    </Modal>
  );
};

export default PlayListDetail;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    height: height - 150,
    width: width - 15,
    backgroundColor: color.APP_BG,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalBG: {
    backgroundColor: color.MODAL_BG,
    zIndex: -1,
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
