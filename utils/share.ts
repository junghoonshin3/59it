import { Share } from "react-native";

type ShareGroupOptions = {
  inviteCode: string;
  groupName?: string;
  customMessage?: string;
  url?: string; // 앱 링크
};

export const shareGroupInviteCode = async ({
  inviteCode,
  groupName,
  customMessage,
  url = "https://example.com", // 기본 앱 링크
}: ShareGroupOptions) => {
  const message =
    customMessage ||
    `모임 이름: ${
      groupName ?? "모임"
    }\n참여코드: ${inviteCode}\n\n앱에서 모임에 참여해보세요!\n\n앱 다운로드: ${url}`;

  try {
    await Share.share({
      message,
      title: "모임 초대 공유",
    });
  } catch (error) {
    console.warn("공유 실패:", error);
  }
};
