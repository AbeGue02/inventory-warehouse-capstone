/**
 * DatabaseScreen component
 * Displays the inventory list and allows interaction with inventory items.
 * Additionally allows the user to choose which company they interact with.
 */

import DatabaseScreenHeader from "@/components/DatabaseScreenHeader";
import InventoryItem from "@/components/InventoryItem";
import TextField from "@/components/TextField";
import type InventoryItemInterface from "@/interfaces/InventoryItem";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import {
    Keyboard,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { globalStyles } from "../styles/global";

// TODO: Replace the static inventory data with data fetched from the selected company's database.
const inventoryData: InventoryItemInterface[] = [
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
  const [items, setItems] = useState<InventoryItemInterface[]>(inventoryData);
  const [selectedItem, setSelectedItem] =
    useState<InventoryItemInterface | null>(null);
  const [draftItem, setDraftItem] = useState<InventoryItemInterface | null>({
    name: "",
    sku: "",
    quantity: 0,
  });

  // Open an inventory item for editing.
  const openItem = (item: InventoryItemInterface) => {
    setSelectedItem(item);
    setDraftItem({ ...item });
  };

  // Save the changes made to the draft item back to the inventory list.
  const saveItem = () => {
    if (!selectedItem || !draftItem) return; // Ensure both selected and draft items exist before saving.

    setItems((currentItems) =>
      currentItems.map(
        (item) => (item.sku === selectedItem.sku ? { ...draftItem } : item), // Update the item if it matches the selected item's SKU.
      ),
    );

    // Clear the selected and draft items after saving.
    setSelectedItem(null);
    setDraftItem({ name: "", sku: "", quantity: 0 });
  };

  return (
    <View style={globalStyles.databaseScreen}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={globalStyles.databaseScreen}>
          <DatabaseScreenHeader />
          <View style={globalStyles.databaseScreenContent}>
            <FlashList
              style={globalStyles.databaseList}
              data={items}
              renderItem={({ item }) => (
                <InventoryItem
                  name={item.name}
                  sku={item.sku}
                  quantity={item.quantity}
                  onPress={() => openItem(item)}
                />
              )}
              keyExtractor={(item) => item.sku}
            />

            {/* 
                Inventory item edit modal
                Only renders when an inventory item is selected for editing.
            */}
            <Modal
              visible={selectedItem !== null}
              transparent
              animationType="slide"
              onRequestClose={() => setSelectedItem(null)}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  setSelectedItem(null);
                  Keyboard.dismiss();
                }}
              >
                <View style={globalStyles.modalOverlay}>
                  <View style={globalStyles.modalCard}>
                    <Text style={globalStyles.modalTitle}>
                      Edit Inventory Item
                    </Text>

                    <TextField
                      label="Name"
                      placeholder="Item name"
                      value={draftItem?.name}
                    />

                    <TextField
                      label="SKU"
                      placeholder="SKU"
                      value={draftItem?.sku}
                    />

                    <TextField
                      label="Quantity"
                      placeholder="Quantity"
                      value={draftItem?.quantity.toString()}
                    />

                    <View style={globalStyles.modalActions}>
                      <TouchableOpacity
                        style={globalStyles.modalCancelButton}
                        onPress={() => setSelectedItem(null)}
                      >
                        <Text style={globalStyles.modalCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={globalStyles.modalSaveButton}
                        onPress={saveItem}
                      >
                        <Text style={globalStyles.modalSaveText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
