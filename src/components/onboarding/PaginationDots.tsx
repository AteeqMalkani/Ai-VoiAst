import { View } from "react-native";

type Props = {
  total: number;
  active: number;
};

export default function PaginationDots({ total, active }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 28,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={{
            width: active === index ? 28 : 8,
            height: 8,
            borderRadius: 999,
            marginHorizontal: 4,
            backgroundColor:
              active === index ? "#3B82F6" : "rgba(255,255,255,0.2)",
          }}
        />
      ))}
    </View>
  );
}
