import { View, Text } from "react-native";

type HeaderProps = {
  greeting: string;
  name: string;
};

export default function Header({ greeting, name }: HeaderProps) {
  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 30,
      }}
    >
      <Text
        style={{
          color: "#94A3B8",
          fontSize: 18,
        }}
      >
        {greeting}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 34,
          fontWeight: "700",
          marginTop: 4,
        }}
      >
        {name} 👋
      </Text>
    </View>
  );
}
