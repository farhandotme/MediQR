import { Dimensions, FlatList, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../../assets/images/onboarding.png"),
    title: "Instant Emargency Access",
    discription:
      "Doctor Can Instantly access Life-Saving Medical Information by Scanning your QR",
  },
  {
    id: "2",
    image: require("../../assets/images/onboarding2.png"),
    title: "Every Second Matters",
    discription:
      "Blood group ,allergies and conditions available when you can't speak",
  },
  {
    id: "3",
    image: require("../../assets/images/onboarding3.png"),
    title: "Private and Secure",
    discription:
      "Your data is encrypted and visible only in Medical Emargencies ",
  },
];

const onboarding2 = () => {
  return (
    <SafeAreaView className="flex-1">
      <FlatList
        horizontal
        data={slides}
        contentContainerStyle={{ height: height * 0.75 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Slide item={item} />}
      />
    </SafeAreaView>
  );
};

export default onboarding2;
