/*
  Creates Floating Action Button for adding new items
*/

import { SymbolView } from "expo-symbols";
import { Pressable, Text } from "react-native";
import { colors, globalStyles } from "../styles/global";

export default function AddItemButton(props: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add item"
      onPress={props.onPress}
      style={globalStyles.fab}
    >
      <SymbolView
        name={{ ios: "plus", android: "add", web: "add" }}
        tintColor={colors.onPrimary}
        size={28}
        fallback={<Text style={globalStyles.fallback}>+</Text>}
      />
    </Pressable>
  );
}
