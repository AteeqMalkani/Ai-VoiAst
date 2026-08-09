import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface PreferencesContextType {
  assistantName: string;
  userName: string;
  updatePreferences: (
    newAssistantName: string,
    newUserName: string,
  ) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType>({
  assistantName: "VoiAst",
  userName: "Ateeq",
  updatePreferences: async () => {},
});

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [assistantName, setAssistantName] = useState("VoiAst");
  const [userName, setUserName] = useState("Ateeq");

  useEffect(() => {
    // Load saved preferences on startup
    AsyncStorage.getItem("@user_preferences").then((data) => {
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.assistantName) setAssistantName(parsed.assistantName);
        if (parsed.userName) setUserName(parsed.userName);
      }
    });
  }, []);

  const updatePreferences = async (
    newAssistantName: string,
    newUserName: string,
  ) => {
    setAssistantName(newAssistantName);
    setUserName(newUserName);
    await AsyncStorage.setItem(
      "@user_preferences",
      JSON.stringify({
        assistantName: newAssistantName,
        userName: newUserName,
      }),
    );
  };

  return (
    <PreferencesContext.Provider
      value={{ assistantName, userName, updatePreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
