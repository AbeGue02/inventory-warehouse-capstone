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
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { globalStyles } from "../styles/global";

export default function DatabaseScreen() {
  const [isFetchingItems, setIsFetchingItems] = useState(true); // State to track if items are being fetched.
  const [items, setItems] = useState<InventoryItemInterface[]>([]); // State to hold the list of inventory items.
  const [selectedItem, setSelectedItem] =
    useState<InventoryItemInterface | null>(null); // State to hold the currently selected inventory item for editing.
  const [draftItem, setDraftItem] = useState<InventoryItemInterface | null>({
    name: "",
    sku: "",
    quantity: 0,
  }); // State to hold a draft copy of the selected inventory item being edited.

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data);
      setIsFetchingItems(false);
    }

    fetchData();
  }, []);

  // Open an inventory item for editing.
  const openItem = (item: InventoryItemInterface) => {
    setSelectedItem(item);
    setDraftItem({ ...item });
  };

  // Save the changes made to the draft item back to the inventory list.
  const saveItem = () => {
    // Ensure both selected and draft items exist before saving.
    if (!selectedItem || !draftItem) return;

    // Update the item if it matches the selected item's SKU.
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.sku === selectedItem.sku ? { ...draftItem } : item,
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
            {isFetchingItems ? ( // Are Items Being Fetched or Available?
              <ActivityIndicator size="large" color="#aaa" />
            ) : items.length === 0 ? ( // No items available
              <Text style={globalStyles.noItemsText}>No items available.</Text>
            ) : (
              // Items are available and ready to be displayed
              <FlashList
                style={globalStyles.databaseList}
                data={items}
                renderItem={({ item }) => (
                  <InventoryItem item={item} onPress={() => openItem(item)} />
                )}
                keyExtractor={(item) => item.sku}
              />
            )}

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
