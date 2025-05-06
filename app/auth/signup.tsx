import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  StatusBar,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Topbar from "@/components/topbar";
import FormField from "@/components/formfield";
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/confirmbutton";

export default function SignUp() {
  const router = useRouter();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [nickName, setNickName] = useState("");
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      showSubscription.remove();
    };
  }, []);

  const handleKeyboardShow = () => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = () => {
    setIsKeyboardVisible(false);
  };

  return (
    <KeyboardAvoidingView
      enabled
      style={{
        flex: 1,
        paddingHorizontal: 32,
        backgroundColor: "#1C1D1F",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        Platform.OS === "ios"
          ? 0
          : isKeyboardVisible
          ? StatusBar.currentHeight
          : 0
      }
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <Topbar
            title="가입하기"
            image={require("../../assets/images/back_button.png")}
            onPress={() => router.back()}
          />

          <FormField
            className="mt-[20px]"
            label="이메일"
            placeholder="이메일을 입력하세요"
            icon={require("../../assets/images/email_field.png")}
            readOnly={true}
            error=""
            value=""
            onChangeText={() => {}}
          />

          <FormField
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            icon={require("../../assets/images/name_field.png")}
            readOnly={false}
            error=""
            value={nickName}
            onChangeText={setNickName}
            className="mt-[20px]"
          />
        </View>
      </TouchableWithoutFeedback>

      <ConfirmButton
        className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
        title="가입하기"
        onPress={() => router.replace("/maps")}
      />
    </KeyboardAvoidingView>
  );
}
