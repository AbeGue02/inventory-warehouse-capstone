/**
 * InventoryItem component
 * Represents a single inventory item in the inventory list.
 */

import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function InventoryItem(props: {
  name: string;
  sku: string;
  quantity: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={globalStyles.inventoryItem}
      onPress={props.onPress}
    >
      <View>
        <Text>{props.name}</Text>
        <Text>{props.sku}</Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        {/* TODO: Implement functionality to decrease the quantity */}
        <TouchableOpacity>
          <Text style={globalStyles.linkText}>–</Text>
        </TouchableOpacity>

        {/* TODO: Implement functionality to directly edit the quantity via the text input */}
        <TextInput
          value={props.quantity.toString()}
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
