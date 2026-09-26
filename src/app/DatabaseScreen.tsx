/**
 * DatabaseScreen component
 * Displays the inventory list and allows interaction with inventory items.
 * Additionally allows the user to choose which company they interact with.
 */

import AddItemButton from "@/components/AddItemButton";
import DatabaseScreenHeader from "@/components/DatabaseScreenHeader";
import EditItemModal from "@/components/EditItemModal";
import InventoryItem from "@/components/InventoryItem";
import type { SortBy } from "@/components/SortMenuModal";
import SortMenuModal from "@/components/SortMenuModal";
import type InventoryItemInterface from "@/interfaces/InventoryItem";
import { FlashList } from "@shopify/flash-list";
import { SymbolView } from "expo-symbols";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { colors, globalStyles } from "../styles/global";

export default function DatabaseScreen() {
  const [isFetchingItems, setIsFetchingItems] = useState<boolean>(true); // State to track if items are being fetched.
  const [items, setItems] = useState<InventoryItemInterface[]>([]); // State to hold the list of inventory items.
  const [selectedItem, setSelectedItem] =
    useState<InventoryItemInterface | null>(null); // State to hold the currently selected inventory item for editing.
  const [draftItem, setDraftItem] = useState<InventoryItemInterface | null>({
    name: "",
    sku: "",
    quantity: 0,
    createdAt: new Date().toISOString(),
    companyId: "", // TODO: Add Company ID handling here.
  }); // State to hold a draft copy of the selected inventory item being edited.
  const [searchBarText, setSearchBarText] = useState<string>(""); // State to hold the text entered in the search bar.
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false); // State to track if the sort menu is open.
  const [sortBy, setSortBy] = useState<SortBy>("alphabetical"); // State to track the current sort type.
  const [isReversed, setIsReversed] = useState<boolean>(false); // State to track if the sort order is reversed.

  // Use a deferred value for the search bar text to improve performance during typing.
  // This deferred value will lag behind the actual search bar text,
  // allowing the UI to remain responsive during typing.
  const deferredSearchBarText = useDeferredValue(searchBarText);
  const isSearchingItems = deferredSearchBarText !== searchBarText;

  // Sort the items based on the sort type and order.
  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.name.localeCompare(b.name); // Sort alphabetically by name
        case "newest":
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime() // Sort by newest first
          );
        case "quantity":
          return a.quantity - b.quantity; // Sort by quantity in ascending order
      }
    });

    return isReversed ? sorted.reverse() : sorted; // Reverse the sorted list if needed based on the isReversed flag.
  }, [items, sortBy, isReversed]);

  // Create a map of items by their SKU for quick lookup.
  // Mapping the items causes the application to have a O(1) lookup time for SKUs instead of O(n).
  const itemsBySku = useMemo(
    () => new Map(sortedItems.map((item) => [item.sku.toLowerCase(), item])),
    [sortedItems],
  );

  // When searching, search for both item names and exact SKU matches
  // Return both the exact match (if any) and other matches separately.
  const searchResults = useMemo(() => {
    const query = deferredSearchBarText.trim().toLowerCase();

    // if the search bar is empty, return all items as other matches.
    if (query === "") {
      return { exactMatch: null, otherMatches: sortedItems };
    }

    const exactMatch = itemsBySku.get(query) ?? null; // Get the exact match by SKU if it exists.
    const otherMatches = sortedItems.filter(
      // Filter out the exact match and include items whose names contain the query.
      (item) => item !== exactMatch && item.name.toLowerCase().includes(query),
    );

    return { exactMatch, otherMatches };
  }, [deferredSearchBarText, sortedItems, itemsBySku]);

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
  const saveItem = async () => {
    if (!draftItem) return; // Ensure the draft item exists before proceeding.

    const itemId = selectedItem?._id; // Get the ID of the selected item, if it exists.
    const creating = !itemId; // Determine if we are creating a new item (no ID) or updating an existing one.

    const response = await fetch(
      // Shapes API request URL based on whether we are creating or updating an item.
      creating ? "/api/items" : `/api/items?id=${encodeURIComponent(itemId)}`,
      {
        method: creating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draftItem.name,
          sku: draftItem.sku,
          quantity: Number(draftItem.quantity),
          company: draftItem.companyId,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to save item:", result.error);
      return;
    }

    const savedItem: InventoryItemInterface = {
      _id: result._id,
      name: result.name,
      sku: result.sku,
      quantity: result.quantity,
      createdAt: result.createdAt,
      companyId: result.company, // TODO: ADD COMPANY CONTEXT LOGIC FOR CREATING OBJECTS
    };

    setItems((currentItems) =>
      creating
        ? [...currentItems, savedItem]
        : currentItems.map((item) => (item._id === itemId ? savedItem : item)),
    );

    setSelectedItem(null);
    setDraftItem(null);
  };

  return (
    <View style={globalStyles.databaseScreen}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={globalStyles.databaseScreen}>
          <DatabaseScreenHeader />
          <AddItemButton
            onPress={() =>
              openItem({
                name: "",
                sku: "",
                quantity: 0,
                createdAt: new Date().toISOString(),
                companyId: "",
              })
            }
          />
          <View style={globalStyles.searchBarContainer}>
            <TextInput
              style={globalStyles.searchBar}
              value={searchBarText}
              onChangeText={setSearchBarText}
              placeholder="Search items and SKUs..."
            />
            <Pressable
              style={globalStyles.sortButton}
              onPress={() => setIsSortMenuOpen(true)}
            >
              <SymbolView
                name={{
                  ios: "arrow.up.arrow.down",
                  android: "swap_vert",
                  web: "swap_vert",
                }}
                tintColor={colors.primary}
                size={24}
                fallback={<Text style={{ color: colors.primary }}>Sort</Text>}
              />
            </Pressable>
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
            <EditItemModal
              visible={selectedItem !== null}
              draftItem={draftItem}
              onCancel={() => setSelectedItem(null)}
              onSave={saveItem}
              onChangeDraftItem={setDraftItem}
            />

            {/* 
                Sort menu modal 
                Only renders when the sort menu is open. 
            */}
            <SortMenuModal
              visible={isSortMenuOpen}
              sortBy={sortBy}
              isReversed={isReversed}
              onSelectSortBy={setSortBy}
              onToggleReversed={() => setIsReversed((current) => !current)}
              onClose={() => setIsSortMenuOpen(false)}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
