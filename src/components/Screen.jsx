import { View, StatusBar } from "react-native";
import React from "react";
import color from "../misc/color";

const Screen = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.APP_BG,
        paddingTop: StatusBar.currentHeight,
      }}
    >
      {children}
    </View>
  );
};

export default Screen;
