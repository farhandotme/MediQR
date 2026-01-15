import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold text-blue-600 mb-4">
        Welcome to NativeWind!
      </Text>
      <Text className="text-gray-600 text-center px-6">
        Edit app/index.tsx to edit this screen. NativeWind is now configured and ready to use.
      </Text>
    </View>
  );
}
