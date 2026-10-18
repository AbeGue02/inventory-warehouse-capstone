/**
 * InventoryItem component
 * Represents a single inventory item in the inventory list.
 */

import InventoryItemInterface from "@/interfaces/InventoryItem";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function InventoryItem(props: {
  item: InventoryItemInterface;
  onPress: () => void;
  onChangeQuantity: (quantity: number) => void;
}) {
  // Held as text so the field can be fully cleared. saved on blur, empty becomes 0.
  const [quantityText, setQuantityText] = useState(
    props.item.quantity.toString(),
  );

  useEffect(() => {
    setQuantityText(props.item.quantity.toString());
  }, [props.item.quantity]);

  const commitQuantity = () => {
    const quantity = quantityText === "" ? 0 : parseInt(quantityText, 10);
    setQuantityText(quantity.toString());
    if (quantity !== props.item.quantity) props.onChangeQuantity(quantity);
  };

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
        <TouchableOpacity
          onPress={() =>
            props.onChangeQuantity(Math.max(0, props.item.quantity - 1))
          }
        >
          <Text style={globalStyles.linkText}>–</Text>
        </TouchableOpacity>

        <TextInput
          value={quantityText}
          onChangeText={(text) =>
            setQuantityText(
              text.replace(/\D/g, "" /* Remove non-digit characters */),
            )
          }
          onBlur={commitQuantity}
          onSubmitEditing={commitQuantity}
          keyboardType="numeric"
          style={globalStyles.numericTextField}
        />

        <TouchableOpacity
          onPress={() => props.onChangeQuantity(props.item.quantity + 1)}
        >
          <Text style={globalStyles.linkText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
