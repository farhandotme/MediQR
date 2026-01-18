import { Dimensions, View } from "react-native";
import React, { useEffect, useRef } from "react";

import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

const { height, width } = Dimensions.get("window");

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

const slides = [
  {
    backgroundColor: "white",
    image: (
      <View>
        <LottieSlide
          source={require("../../assets/lottie/OnlineDoctor.json")}
        />
      </View>
    ),
    title: "Instant Emargency Access",
    subtitle:
      "Doctor Can Instantly access Life-Saving Medical Information by Scanning your QR",
  },
  {
    backgroundColor: "white",
    image: (
      <View>
        <LottieSlide source={require("../../assets/lottie/Time Table.json")} />
      </View>
    ),
    title: "Every Second Matters",
    subtitle:
      "Blood group ,allergies and conditions available when you can't speak",
  },
  {
    backgroundColor: "white",
    image: (
      <View>
        <LottieSlide source={require("../../assets/lottie/Security.json")} />
      </View>
    ),
    title: "Private and Secure",
    subtitle: "Your data is encrypted and visible only in Medical Emargencies ",
  },
];

const onboarding2 = () => {
  return (
    <Onboarding
      onSkip={() => {
        router.replace("/registerPage/registerpage");
      }}
      onDone={() => {
        router.replace("/registerPage/registerpage");
      }}
      pages={slides}
      titleStyles={{ fontWeight: "bold", marginHorizontal: 0, lineHeight: 0 }}
      subTitleStyles={{
        marginLeft: 50,
        marginRight: 50,
        fontWeight: "700",
        marginHorizontal: 0,
        lineHeight: 0,
      }}
      imageContainerStyles={{ marginBottom: 0, marginHorizontal: 0 }}
    />
  );
};

export default onboarding2;
