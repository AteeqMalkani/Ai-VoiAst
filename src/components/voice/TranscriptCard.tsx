import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type TranscriptCardProps = {
  transcript: string;
};

export default function TranscriptCard({ transcript }: TranscriptCardProps) {
  return (
    <View
      style={{
        width: "100%",
        marginTop: 28,
        padding: 18,
        borderRadius: 20,
        backgroundColor: "#111827",
        borderWidth: 1,
        borderColor: "#1F2937",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <MaterialCommunityIcons
          name="text-box-outline"
          size={20}
          color="#60A5FA"
        />

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
            marginLeft: 10,
          }}
        >
          Transcript
        </Text>
      </View>

      <Text
        style={{
          color: "#CBD5E1",
          fontSize: 16,
          lineHeight: 24,
        }}
      >
        {transcript || "Your speech will appear here..."}
      </Text>
    </View>
  );
}
