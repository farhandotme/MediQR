// screens/Onboarding.tsx
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
export type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  image: any;
};

const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

interface lottieSlideProps {
  source: any;
}

const LottieSlide = ({ source }: lottieSlideProps) => {
  const animationRef = useRef<LottieView>(null);
  useEffect(() => {
    animationRef.current?.play();
    animationRef.current?.play(30, 120);
  }, []);
  return (
    <LottieView
      ref={animationRef}
      source={source}
      autoPlay
      loop
      style={{ width: 300, height: 300 }}
    />
  );
};

export const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Welcome",
    description: "Manage everything from one place",
    image: (
      <View>
        <LottieSlide
          source={require("../../assets/lottie/OnlineDoctor.json")}
        />
      </View>
    ),
  },
  {
    id: "2",
    title: "Fast & Secure",
    description: "Your data is protected and safe",
    image: (
      <View>
        <LottieSlide
          source={require("../../assets/lottie/OnlineDoctor.json")}
        />
      </View>
    ),
  },
  {
    id: "3",
    title: "Get Started",
    description: "Let’s begin your journey",
    image: (
      <View>
        <LottieSlide
          source={require("../../assets/lottie/OnlineDoctor.json")}
        />
      </View>
    ),
  },
];

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToOffset({
        offset: (currentIndex + 1) * width,
        animated: true,
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: "center", padding: 20 }}>
            <Image
              source={item.image}
              style={{ width: 250, height: 250, marginTop: 80 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 30 }}>
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                marginTop: 15,
                color: "#666",
              }}
            >
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={{
              width: currentIndex === index ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentIndex === index ? "#000" : "#ccc",
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>

      {/* Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <TouchableOpacity>
          <Text style={{ fontSize: 16, color: "#999" }}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goNext}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {currentIndex === onboardingData.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
