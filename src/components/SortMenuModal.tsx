/**
 * SortMenuModal component
 * Popup menu for choosing the inventory sort type and direction.
 */

import {
    Modal,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { globalStyles } from "../styles/global";

export type SortBy = "alphabetical" | "newest" | "quantity";

const SORT_LABELS: Record<SortBy, string> = {
  alphabetical: "Alphabetical",
  newest: "Newest",
  quantity: "Quantity",
};

// Custom reverse label per sort type instead of generic "ascending/descending"
const REVERSE_LABELS: Record<SortBy, [string, string]> = {
  alphabetical: ["A → Z", "Z → A"],
  newest: ["Newest First", "Oldest First"],
  quantity: ["Low → High", "High → Low"],
};

export default function SortMenuModal(props: {
  visible: boolean;
  sortBy: SortBy;
  isReversed: boolean;
  onSelectSortBy: (sortBy: SortBy) => void;
  onToggleReversed: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="fade"
      onRequestClose={props.onClose}
    >
      <TouchableWithoutFeedback onPress={props.onClose}>
        <View style={globalStyles.sortMenuOverlay}>
          <TouchableWithoutFeedback>
            <View style={globalStyles.sortMenu}>
              {(Object.keys(SORT_LABELS) as SortBy[]).map((option) => (
                <Pressable
                  key={option}
                  style={globalStyles.sortMenuOption}
                  onPress={() => props.onSelectSortBy(option)}
                >
                  <Text
                    style={[
                      globalStyles.sortMenuOptionText,
                      props.sortBy === option &&
                        globalStyles.sortMenuOptionTextSelected,
                    ]}
                  >
                    {SORT_LABELS[option]}
                  </Text>
                </Pressable>
              ))}

              <View style={globalStyles.sortMenuDivider} />

              <Pressable
                style={globalStyles.sortMenuOption}
                onPress={props.onToggleReversed}
              >
                <Text style={globalStyles.sortMenuDirectionText}>
                  {REVERSE_LABELS[props.sortBy][props.isReversed ? 1 : 0]}
                </Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
