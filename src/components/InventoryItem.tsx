/**
 * InventoryItem component
 * Represents a single inventory item in the inventory list.
 */

import InventoryItem from "@/interfaces/InventoryItem";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function InventoryItem(props: {
  item: InventoryItem;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={globalStyles.inventoryItem}
      onPress={props.onPress}
    >
      <View>
        <Text>{props.item.name}</Text>
        <Text>{props.item.sku}</Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        {/* TODO: Implement functionality to decrease the quantity */}
        <TouchableOpacity>
          <Text style={globalStyles.linkText}>–</Text>
        </TouchableOpacity>

        {/* TODO: Implement functionality to directly edit the quantity via the text input */}
        <TextInput
          value={props.item.quantity.toString()}
          keyboardType="numeric"
          style={globalStyles.numericTextField}
        />

        {/* TODO: Implement functionality to increase the quantity */}
        <TouchableOpacity>
          <Text style={globalStyles.linkText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
