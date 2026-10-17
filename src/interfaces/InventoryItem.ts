/**
 * Interface representing an inventory item in the Inventory Warehouse application.
 */

export default interface InventoryItemInterface {
  name: string;
  sku: string;
  quantity: number;
  createdAt: string;
  companyId: string;
  _id?: string; // Optional because Item might not have an ID until it's saved in the database.
}
