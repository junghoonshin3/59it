import { View, Text, Image, Linking } from "react-native";
import React, { useState } from "react";
import PermissionItem from "@/components/permissionitem";
import ConfirmButton from "@/components/confirmbutton";
import {
  requestLocationPermissionsAsync,
  startLocationUpdatesAsync,
} from "@/services/locationService";
import { useRouter } from "expo-router";
import CommonModal, { CommonModalProps } from "@/components/commonpopup";
import { storage } from "@/utils/storage";
import { useAuthStore } from "@/store/useAuthStore";

export default function Permission() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    confirmText: "확인",
    onConfirm: () => {},
  });
  const session = useAuthStore((state) => state.session);

  const requestLocationPermission = async () => {
    const { foregroundStatus, backgroundStatus, canAskAgain } =
      await requestLocationPermissionsAsync();
    const hasOnboarding = await storage.getBoolean("onboardingSeen");

    // 둘 다 권한이 허용된 경우
    if (foregroundStatus === "granted" && backgroundStatus === "granted") {
      if (!hasOnboarding) {
        router.replace("/onboarding");
        return;
      }
      console.log("session >>>>>>>>>>>>>>>>>>>>>> ", session?.access_token);
      if (!session) {
        router.replace("/auth/signin"); // 로그인을 위해 signin 화면으로 이동
        return;
      }
      router.replace("/maps"); // 이미 로그인을 한 경우 맵화면으로 이동
      return;
    }

    // 권한 요청이 다시 가능한 경우 (팝업에서 재요청)
    if (canAskAgain) {
      setModalContent({
        title: "권한 요청",
        description:
          "정확한 위치 서비스를 위해 위치 권한을 '항상허용'으로 해주세요.",
        confirmText: "확인",
        onConfirm: requestLocationPermission, // 다시 요청
      });
      setModalVisible(true);
      return;
    }

    // 다시 요청 불가능한 경우 (설정으로 유도)
    setModalContent({
      title: "권한이 필요해요",
      description:
        "앱 설정에서 위치 권한을 항상 허용으로 변경해주세요.\n(앱 정보 > 권한 > 위치 > 항상허용)",
      confirmText: "설정으로 이동",
      onConfirm: () => {
        setModalVisible(false);
        Linking.openSettings(); // 설정 앱 열기
      },
    });
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-background ps-[32px] pe-[32px]">
      <Text className="text-[24px] leading-[30px] font-medium tracking-[-0.5px] text-white mt-[30px]">{`59it 사용을 위해\n앱 권한을 허용해주세요`}</Text>
      <View className=" mt-[30px] bg-[#1F222A] rounded-[16px] pt-[20px] ps-[20px] pe-[20px] pb-[20px]">
        <Text className="text-[14px] leading-[22px] font-medium tracking-[-0.5px] text-white mb-[15px]">
          선택권한
        </Text>
        <PermissionItem
          icon={require("../../assets/images/notification_bell_white.png")}
          title="알림"
          description="앱 알림 수신시 필요"
        />
        <Text className="text-[14px] leading-[22px] font-medium tracking-[-0.5px] text-[#00C2FF] mb-[15px] mt-[15px]">
          필수권한
        </Text>
        <PermissionItem
          icon={require("../../assets/images/location.png")}
          title="위치"
          description="사용자의 위치를 파악시 필요"
        />
        <Text className="text-[#00C2FF] text-[10px] ms-[10px] mt-[5px]">
          * 위치권한은 반드시 항상허용으로 선택해주세요.
        </Text>
        <Text className="text-[#00C2FF] text-[10px] ms-[10px]">
          {`* 앱 정보 > 권한 > 위치 > 항상허용으로 변경해주세요.`}
        </Text>
      </View>

      <View className="flex-1" />
      <ConfirmButton
        className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
        title="확인"
        onPress={requestLocationPermission}
      />
      <CommonModal
        visible={modalVisible}
        title={modalContent.title}
        description={modalContent.description}
        confirmText={modalContent.confirmText}
        cancelText="닫기"
        onConfirm={modalContent.onConfirm}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}
