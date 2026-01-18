import { View, Text, Image, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const Onboarding1 = () => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 90,
      duration: 2000,
      useNativeDriver: false,
    }).start();
    setTimeout(() => {
      router.push("/onboarding/onboarding2");
    }, 2500);
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center justify-end bg-white">
      <Image
        source={require("../../assets/images/MediQrLogo2.png")}
        style={{ width: 150, height: 150 }}
        resizeMode="contain"
      />

      <View className="flex-row items-center mt-4">
        <Text className="text-[40px] font-bold">Medi</Text>
        <Text className="text-[40px] font-bold text-blue-500">QR</Text>
      </View>

      <Text className="text-[20px] text-gray-400 mt-2">
        Your Emergency Medical Identity
      </Text>

      {/* Loading Bar */}
      <View className="bg-gray-300 h-[6px] w-[90px] rounded-full overflow-hidden mt-80 mb-10">
        <Animated.View
          className="bg-blue-500 h-[6px] rounded-full"
          style={{ width: progressAnim }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding1;
