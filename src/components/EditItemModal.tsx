/**
 * EditItemModal component
 * Modal for editing an inventory item's name, SKU, and quantity.
 */

import type InventoryItemInterface from "@/interfaces/InventoryItem";
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
}) {
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
            />

            <TextField
              label="SKU"
              placeholder="SKU"
              value={props.draftItem?.sku}
            />

            <TextField
              label="Quantity"
              placeholder="Quantity"
              value={props.draftItem?.quantity.toString()}
            />

            <View style={globalStyles.modalActions}>
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
