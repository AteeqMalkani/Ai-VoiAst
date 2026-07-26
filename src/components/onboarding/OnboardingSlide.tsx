import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  illustration: ReactNode;
  title: string;
  subtitle: string;
};

export default function OnboardingSlide({
  illustration,
  title,
  subtitle,
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 28,
      }}
    >
      {/* Illustration */}

      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {illustration}
      </View>

      {/* Text */}

      <View
        style={{
          width: "100%",
          minHeight: 150,
          alignItems: "center",
          justifyContent: "flex-start",
          paddingBottom: 20,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 34,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: "#94A3B8",
            fontSize: 18,
            lineHeight: 28,
            textAlign: "center",
            marginTop: 18,
            paddingHorizontal: 10,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
