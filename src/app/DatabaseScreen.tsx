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
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { globalStyles } from "../styles/global";

export default function DatabaseScreen() {
  const [isFetchingItems, setIsFetchingItems] = useState<boolean>(true); // State to track if items are being fetched.
  const [items, setItems] = useState<InventoryItemInterface[]>([]); // State to hold the list of inventory items.
  const [selectedItem, setSelectedItem] =
    useState<InventoryItemInterface | null>(null); // State to hold the currently selected inventory item for editing.
  const [draftItem, setDraftItem] = useState<InventoryItemInterface | null>({
    name: "",
    sku: "",
    quantity: 0,
  }); // State to hold a draft copy of the selected inventory item being edited.
  const [searchBarText, setSearchBarText] = useState<string>(""); // State to hold the text entered in the search bar.

  // Use a deferred value for the search bar text to improve performance during typing.
  // This deferred value will lag behind the actual search bar text,
  // allowing the UI to remain responsive during typing.
  const deferredSearchBarText = useDeferredValue(searchBarText);
  const isSearchingItems = deferredSearchBarText !== searchBarText;

  // Create a map of items by their SKU for quick lookup.
  // Mapping the items causes the application to have a O(1) lookup time for SKUs instead of O(n).
  const itemsBySku = useMemo(
    () => new Map(items.map((item) => [item.sku.toLowerCase(), item])),
    [items],
  );

  // When searching, search for both item names and exact SKU matches
  // Return both the exact match (if any) and other matches separately.
  const searchResults = useMemo(() => {
    const query = deferredSearchBarText.trim().toLowerCase();

    // if the search bar is empty, return all items as other matches.
    if (query === "") {
      return { exactMatch: null, otherMatches: items };
    }

    const exactMatch = itemsBySku.get(query) ?? null; // Get the exact match by SKU if it exists.
    const otherMatches = items.filter(
      // Filter out the exact match and include items whose names contain the query.
      (item) => item !== exactMatch && item.name.toLowerCase().includes(query),
    );

    return { exactMatch, otherMatches };
  }, [deferredSearchBarText, items, itemsBySku]);

  const isSearching = deferredSearchBarText.trim().length > 0; // Determine if the user is currently searching based on the search bar text.
  const visibleItems = isSearching // If searching, show the exact match followed by other matches. Otherwise, show all items.
    ? [
        ...(searchResults.exactMatch ? [searchResults.exactMatch] : []),
        ...searchResults.otherMatches,
      ]
    : searchResults.otherMatches;

  const exactMatch = searchResults.exactMatch; // Extract the exact match from the search results for easier access.
  const searchHeader = isSearching ? ( // Render the search header only when the user is searching.
    <View style={globalStyles.searchHeader}>
      {exactMatch && (
        <>
          <Text>Exact Match:</Text>
          <InventoryItem
            item={exactMatch}
            onPress={() => openItem(exactMatch)}
          />
        </>
      )}
      {searchResults.otherMatches.length > 0 && <Text>Search Results:</Text>}
    </View>
  ) : null;

  useEffect(() => {
    // Fetch inventory items when the component mounts
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
          <View style={globalStyles.searchBarContainer}>
            <TextInput
              style={globalStyles.searchBar}
              value={searchBarText}
              onChangeText={setSearchBarText}
              placeholder="Search items and SKUs..."
            />
            <Button
              title="Sort"
              onPress={() => {
                // TODO: Implement sort functionality here
              }}
            />
          </View>
          <View style={globalStyles.databaseScreenContent}>
            {isFetchingItems || isSearchingItems ? ( // Are Items Being fetched or searched through?
              <ActivityIndicator size="large" color="#aaa" />
            ) : visibleItems.length === 0 ? ( // No items available ?
              <Text style={globalStyles.noItemsText}>No items available.</Text>
            ) : (
              // Items available!
              <FlashList
                style={globalStyles.databaseList}
                data={isSearching ? searchResults.otherMatches : visibleItems}
                ListHeaderComponent={searchHeader}
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
