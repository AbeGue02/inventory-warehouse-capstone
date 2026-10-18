/**
 * EditItemModal component
 * Modal for editing an inventory item's name, SKU, and quantity.
 */

import type InventoryItemInterface from "@/interfaces/InventoryItem";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { globalStyles } from "../styles/global";
import TextField from "./TextField";

export default function EditItemModal(props: {
  visible: boolean;
  draftItem: InventoryItemInterface | null;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  onChangeDraftItem: (draftItem: InventoryItemInterface) => void;
}) {
  // Held as text so the field can be fully cleared; empty is stored as 0.
  const [quantityText, setQuantityText] = useState("");

  useEffect(() => {
    if (props.visible) {
      setQuantityText(props.draftItem?.quantity.toString() ?? "");
    }
  }, [props.visible, props.draftItem?._id]);

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="fade"
      onRequestClose={props.onCancel}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          props.onCancel();
          Keyboard.dismiss();
        }}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalCard}>
            <Text style={globalStyles.modalTitle}>Edit Inventory Item</Text>

            <TextField
              label="Name"
              placeholder="Item name"
              value={props.draftItem?.name}
              onChangeText={(text) => {
                if (props.draftItem) {
                  props.onChangeDraftItem({ ...props.draftItem, name: text });
                }
              }}
            />

            <TextField
              label="SKU"
              placeholder="SKU"
              value={props.draftItem?.sku}
              onChangeText={(text) => {
                if (props.draftItem) {
                  props.onChangeDraftItem({ ...props.draftItem, sku: text });
                }
              }}
            />

            <TextField
              label="Quantity"
              placeholder="Quantity"
              value={quantityText}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, "");
                setQuantityText(digits);
                if (props.draftItem) {
                  props.onChangeDraftItem({
                    ...props.draftItem,
                    quantity: digits === "" ? 0 : parseInt(digits, 10),
                  });
                }
              }}
            />

            <View style={globalStyles.modalActions}>
              <TouchableOpacity
                style={globalStyles.modalDeleteButton}
                onPress={props.onDelete}
              >
                <Text style={globalStyles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>

              <View style={{ flex: 1 }} />

              <TouchableOpacity
                style={globalStyles.modalCancelButton}
                onPress={props.onCancel}
              >
                <Text style={globalStyles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.modalSaveButton}
                onPress={props.onSave}
              >
                <Text style={globalStyles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
