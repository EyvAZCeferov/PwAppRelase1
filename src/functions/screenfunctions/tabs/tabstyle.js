import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Transition, Transitioning } from "react-native-reanimated";
import ICONS from "./src/ICONS";
import { Ionicons } from "@expo/vector-icons";
import Textpopins from "../text";

const { width } = Dimensions.get("window");

const bgColors = {
  home: "#ffe1c5",
  barcode: "#e5c1e5",
  bucket: "#d7d8f8",
  campaigns: "#bce3fa",
  info: "#f2594a",
};

const textColors = {
  home: "#c56b14",
  barcode: "#f37ff3",
  bucket: "#4b458c",
  campaigns: "#2d9cdb",
  info: "#4a5de2",
};

export default function TabComponent({
  labid,
  label,
  accessibilityState,
  onPress,
}) {
  const focused = accessibilityState.selected;
  const icon = !focused ? ICONS.icons[labid] : ICONS.icons[`${labid}FOCUSED`];

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="fade" durationMs={5} />
      <Transition.Change interpolation="easeInOut" durationMs={100} />
      <Transition.In type="fade" durationMs={10} />
    </Transition.Sequence>
  );

  const ref = useRef();

  return (
    <TouchableOpacity
      style={{ width: width / 4.1, height: "100%" }}
      onPress={() => {
        ref.current.animateNextTransition();
        onPress();
      }}
    >
      <Transitioning.View
        focused={focused}
        labid={labid}
        ref={ref}
        transition={transition}
        style={[
          styles.background,
          { backgroundColor: focused ? bgColors[labid] : "white" },
        ]}
      >
        <View style={[styles.cont, { justifyContent: "center" }]}>
          <Ionicons name={icon} size={22} color="#7c9d32" />
          {!focused ? (
            <Textpopins
              style={[
                styles.label,
                { color: focused ? textColors[labid] : "#7c9d32" },
              ]}
            >
              {label}
            </Textpopins>
          ) : null}
        </View>
      </Transitioning.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    justifyContent: "center",
    borderRadius: 30,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  cont: {
    width: "100%",
    height: "100%",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  label: {
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 5,
    textAlign: "center",
  },
  icon: {
    maxWidth: 16,
    maxHeight: 16,
    minHeight: 14,
    minWidth: 14,
  },
});
