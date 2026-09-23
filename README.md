# 📦 Inventory Warehouse 📦

Keep your business organized with Inventory Warehouse, a simple and secure way for small businesses to manage inventory from anywhere. Create an account, connect to your company, view and update stock levels, and add new items in just a few taps. Inventory Warehouse will be available for Android and iOS.

## 👋 Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start your local MongoDB server

   ```bash
   brew services start mongodb-community
   ```

   Verify that MongoDB is available:

   ```bash
   mongosh
   ```

   Create a `.env` file in the project root with:

   ```bash
   MONGODB_URI=mongodb://127.0.0.1:27017/InventoryWarehouse
   ```

3. Seed the database

   ```bash
   npx tsx src/seed.ts
   ```

4. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)
