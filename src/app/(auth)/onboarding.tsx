import { useRef, useState } from "react";
import { Dimensions, FlatList, Pressable, Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import OrbIllustration from "@/components/onboarding/OrbIllustration";
import OrbitScene from "@/components/onboarding/OrbitScene";
import PaginationDots from "@/components/onboarding/PaginationDots";
import PrimaryButton from "@/components/onboarding/PrimaryButton";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Meet VoiAst",
    subtitle:
      "Your AI assistant that listens, understands and automates your daily work.",
    illustration: <OrbIllustration />,
  },
  {
    id: "2",
    title: "One Voice. Multiple Apps.",
    subtitle:
      "Control Gmail, Calendar, Notes, Browser and more using only your voice.",
    illustration: <OrbitScene />,
  },
];

export default function Onboarding() {
  const flatListRef = useRef<FlatList>(null);

  const [index, setIndex] = useState(0);

  const goToSlide = (page: number) => {
    flatListRef.current?.scrollToOffset({
      offset: page * width,
      animated: true,
    });

    setIndex(page);
  };

  const handleNext = () => {
    if (index < slides.length - 1) {
      goToSlide(index + 1);
    } else {
      router.replace("/(auth)/login");
    }
  };

  const handleBack = () => {
    if (index > 0) {
      goToSlide(index - 1);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#070B14",
      }}
    >
      {/* Header */}

      {index > 0 && (
        <Pressable
          onPress={handleBack}
          style={{
            position: "absolute",
            top: 60,
            left: 24,
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: "rgba(255,255,255,0.08)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>
      )}

      {index < slides.length - 1 && (
        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          style={{
            position: "absolute",
            top: 70,
            right: 24,
            zIndex: 20,
          }}
        >
          <Text
            style={{
              color: "#5B8CFF",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Skip
          </Text>
        </Pressable>
      )}

      {/* Slides */}

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 28,
              paddingTop: 70,
            }}
          >
            {/* Center Content */}

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {item.illustration}

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 34,
                  fontWeight: "700",
                  textAlign: "center",
                  marginTop: 40,
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  color: "#94A3B8",
                  fontSize: 18,
                  lineHeight: 28,
                  textAlign: "center",
                  marginTop: 18,
                  paddingHorizontal: 12,
                }}
              >
                {item.subtitle}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Footer */}

      <View
        style={{
          paddingHorizontal: 28,
          paddingBottom: 42,
          alignItems: "center",
        }}
      >
        <PaginationDots total={slides.length} active={index} />

        <View
          style={{
            marginTop: 28,
            width: "100%",
          }}
        >
          <PrimaryButton
            title={index === slides.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
          />
        </View>
      </View>
    </View>
  );
}
