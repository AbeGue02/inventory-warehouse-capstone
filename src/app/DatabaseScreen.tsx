/**
 * DatabaseScreen component
 * Displays the inventory list and allows interaction with inventory items.
 * Additionally allows the user to choose which company they interact with.
 */

import DatabaseScreenHeader from "@/components/DatabaseScreenHeader";
import InventoryItem from "@/components/InventoryItem";
import { FlashList } from "@shopify/flash-list";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { globalStyles } from "../styles/global";

// TODO: Replace the static inventory data with data fetched from the selected company's database.
const inventoryData = [
  { name: "Item 1", sku: "SKU1", quantity: 10 },
  { name: "Item 2", sku: "SKU2", quantity: 5 },
  { name: "Item 3", sku: "SKU3", quantity: 8 },
  { name: "Item 4", sku: "SKU4", quantity: 12 },
  { name: "Item 5", sku: "SKU5", quantity: 7 },
  { name: "Item 6", sku: "SKU6", quantity: 3 },
  { name: "Item 7", sku: "SKU7", quantity: 9 },
  { name: "Item 8", sku: "SKU8", quantity: 4 },
  { name: "Item 9", sku: "SKU9", quantity: 6 },
  { name: "Item 10", sku: "SKU10", quantity: 11 },
  { name: "Item 11", sku: "SKU11", quantity: 2 },
  { name: "Item 12", sku: "SKU12", quantity: 14 },
  { name: "Item 13", sku: "SKU13", quantity: 5 },
  { name: "Item 14", sku: "SKU14", quantity: 8 },
  { name: "Item 15", sku: "SKU15", quantity: 10 },
];

export default function DatabaseScreen() {
  return (
    <View style={globalStyles.databaseScreen}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={globalStyles.databaseScreen}>
          <DatabaseScreenHeader />
          <View style={globalStyles.databaseScreenContent}>
            <FlashList
              style={globalStyles.databaseList}
              data={inventoryData}
              renderItem={({ item }) => (
                <InventoryItem
                  name={item.name}
                  sku={item.sku}
                  quantity={item.quantity}
                />
              )}
              keyExtractor={(item) => item.sku.toString()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
