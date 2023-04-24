import {
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import color from "../misc/color";

const OptionModal = ({
  visible,
  currentItem,
  onClose,
  onPlayPress,
  onPlayListPress,
}) => {
  const { filename } = currentItem;
  return (
    <>
      <StatusBar hidden></StatusBar>
      <Modal animationType="fade" transparent visible={visible}>
        <View tw="absolute inset-x-0 bottom-0" style={styles.modal}>
          <Text numberOfLines={2} style={styles.title}>
            {filename}
          </Text>
          <View tw="p-5">
            <TouchableOpacity onPress={onPlayPress}>
              <Text style={styles.option}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPlayListPress}>
              <Text style={styles.option}>Add to Playlist</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
          <View tw="absolute inset-0" style={styles.modalBg}></View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default OptionModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: color.APP_BG,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
  },
  title: {
    color: color.FONT_MEDIUM,
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 0,
  },
  option: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.FONT,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  modalBg: {
    backgroundColor: color.MODAL_BG,
  },
});
