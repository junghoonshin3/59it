import { View, Text, Keyboard } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import Topbar from "@/components/topbar";
import { useRouter } from "expo-router";
import InviteCodeInput from "@/components/InviteCodeInput";
import ConfirmButton from "@/components/confirmbutton";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import CommonModal from "@/components/commonpopup";
import { useUser } from "@/api/auth/hooks/useAuth";
import { useJoinGroup } from "@/api/groups/hooks/useGroups";

interface ErrorState {
  visible: boolean;
  title: string;
  description: string;
}

export default function JoinGroup() {
  const router = useRouter();
  const { data: user } = useUser();
  const [code, setCode] = useState<string[]>(() => Array(6).fill(""));
  const [errorObj, setErrorObj] = useState<ErrorState | null>(null);
  const joinGroupMutation = useJoinGroup();
  // 코드가 모두 입력되었는지 확인
  const isCodeComplete = useMemo(() => {
    return code.every((digit) => digit.trim() !== "") && code.length === 6;
  }, [code]);

  // 코드 리셋 함수 최적화
  const resetCode = useCallback(() => {
    setCode(Array(6).fill(""));
  }, []);

  // 에러 모달 표시 함수
  const showError = useCallback((title: string, description: string) => {
    setErrorObj({
      visible: true,
      title,
      description,
    });
  }, []);

  // 에러 모달 닫기 함수
  const hideError = useCallback(() => {
    setErrorObj(null);
    resetCode();
  }, [resetCode]);

  // 그룹 참여 함수 최적화
  const handleJoinByInviteCode = useCallback(async () => {
    if (!isCodeComplete || joinGroupMutation.isPending) return;

    if (!user?.id) {
      showError(
        "인증 오류",
        "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요."
      );
      return;
    }

    try {
      const inviteCode = code.join("");
      await joinGroupMutation.mutateAsync({
        inviteCode: inviteCode,
        userId: user.id,
      });

      router.push("/maps");
    } catch (error) {
      console.error("그룹 참여 중 오류:", error);
      showError(
        "참여 실패",
        "모임 참여 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  }, [
    code,
    isCodeComplete,
    joinGroupMutation.isPending,
    user?.id,
    showError,
    router,
  ]);

  // 코드 변경 핸들러 최적화
  const handleCodeChange = useCallback((newCode: string[]) => {
    setCode(newCode);
  }, []);

  // 키보드 해제 핸들러
  const handleDismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // 뒤로가기 핸들러
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View className="w-full h-full bg-background px-[32px]">
        <Topbar
          title="코드입력"
          onPress={handleGoBack}
          image={require("@/assets/images/back_button.png")}
        />

        <Text className="text-[14px] text-[#9EA3B2] text-regular mt-[40px] leading-[22px]">
          {`친구에게 받은 초대 코드를 입력하세요!\n해당 코드는 24시간 유지됩니다.`}
        </Text>

        <InviteCodeInput
          value={code}
          onChange={handleCodeChange}
          className="flex-row justify-between mt-[40px]"
        />

        <View className="flex-1" />

        <ConfirmButton
          className={`h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px] ${
            isCodeComplete && !joinGroupMutation.isPending
              ? "bg-[#0075FF]"
              : "bg-[#0075FF] opacity-50"
          }`}
          title="참여하기"
          disabled={!isCodeComplete || joinGroupMutation.isPending}
          loading={joinGroupMutation.isPending}
          indicatorColor="#ffffff"
          onPress={handleJoinByInviteCode}
        />

        <CommonModal
          title={errorObj?.title}
          description={errorObj?.description}
          visible={errorObj?.visible ?? false}
          onConfirm={hideError}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
