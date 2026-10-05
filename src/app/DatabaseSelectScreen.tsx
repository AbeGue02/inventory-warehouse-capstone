/**
 * DatabaseSelectScreen component
 * Lets the authenticated user choose (or create) the company database to open.
 */

import TextField from "@/components/TextField";
import { Company, useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../styles/global";

export default function DatabaseSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { authFetch, selectCompany, logout } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newName, setNewName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await authFetch("/api/companies");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setCompanies(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load databases",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompanies();
  }, [authFetch]);

  const openCompany = useCallback(
    (company: Company) => {
      selectCompany(company);
      router.replace("/DatabaseScreen");
    },
    [selectCompany, router],
  );

  const createCompany = async () => {
    if (!newName.trim()) return;
    const response = await authFetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Failed to create database");
      return;
    }
    setNewName("");
    openCompany(result);
  };

  return (
    <View style={[globalStyles.screen, { paddingTop: insets.top }]}>
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}>Select a Database</Text>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        {isLoading ? (
          <ActivityIndicator size="large" color="#aaa" />
        ) : (
          <FlatList
            data={companies}
            keyExtractor={(company) => company._id}
            ListEmptyComponent={<Text>No databases yet.</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={() => openCompany(item)}
              >
                <Text style={globalStyles.primaryButtonText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        <TextField
          label="New Database"
          placeholder="Company name"
          value={newName}
          onChangeText={setNewName}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={createCompany}
        >
          <Text style={globalStyles.primaryButtonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Text style={globalStyles.signUpText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
