import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import color from "../utils/color";
import { convertTime } from "../utils/helper";

const AudioItem = ({title, duration,}) => {
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={styles.leftContainer}>
            <View style={styles.thumbnail}>
              <Text style={styles.thumbnailText}>{title[0]}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo
            name="dots-three-vertical"
            tw="p-10"
            size={20}
            color={color.FONT_MEDIUM}
          />
        </View>
      </View>
      <View style={styles.separator}></View>
    </>
  );
};
//     albumId: "1642794701"
// creationTime: 0
// duration: 2.867
// filename: "Êm ái.ogg"
// height: 0
// id: "34"
// mediaType: "audio"
// modificationTime: 1648461646000
// uri: "file:///storage/emulated/0/Android/media/com.google.android.gm/Notifications/Calm/Êm ái.ogg"
// width: 0

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 80,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    color: color.FONT,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: color.FONT,
  },
  separator: {
    width: width - 80,
    backgroundColor: "#333",
    opacity: 0.3,
    height: 0.5,
    alignSelf: "center",
    margin: 5,
  },
  timeText: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },
});

export default AudioItem;
