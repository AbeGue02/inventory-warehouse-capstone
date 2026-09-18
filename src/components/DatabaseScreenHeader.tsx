/**
 * DatabaseScreenHeader component
 * Displays the header for the database screen with a selectable database button.
 */

import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { globalStyles } from "../styles/global";

export default function DatabaseScreenHeader() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  return (
    <View
      style={[globalStyles.databaseScreenHeader, { paddingTop: insets.top }]}
    >
      {/* TODO: Implement database selection logic here */}
      <TouchableOpacity style={globalStyles.databaseSelectButton}>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Database
        </Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={logout}
        style={globalStyles.databaseLogOutButton}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
