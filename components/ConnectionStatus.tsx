import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SubscriptionStatus } from "@/store/groups/useLocationSharingStore";

interface ConnectionStatusProps {
  isSharing: boolean;
  subscribeState: SubscriptionStatus;
  top: number;
  onReconnect?: () => void;
}

export default function ConnectionStatus({
  top,
  isSharing,
  subscribeState,
  onReconnect,
}: ConnectionStatusProps) {
  if (!isSharing) return null;

  // 구독 상태 표시 컴포넌트
  const SubscriptionStatusIndicator = () => {
    const getStatusColor = () => {
      switch (subscribeState) {
        case "connected":
          return "#4CAF50";
        case "connecting":
          return "#FF9800";
        case "error":
          return "#F44336";
        case "disconnected":
          return "#757575";
        default:
          return "#757575";
      }
    };

    const getStatusText = () => {
      switch (subscribeState) {
        case "connected":
          return "실시간 연결됨";
        case "connecting":
          return "연결 중...";
        case "error":
          return "연결 오류";
        case "disconnected":
          return "연결 끊김";
        default:
          return "알 수 없음";
      }
    };

    return (
      <View
        style={{
          position: "absolute",
          top: top + 30,
          right: 16,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: getStatusColor(),
            marginRight: 6,
          }}
        />
        <Text style={{ color: "white", fontSize: 12, fontWeight: "500" }}>
          {getStatusText()}
        </Text>
      </View>
    );
  };

  // 재연결 버튼 컴포넌트
  const ReconnectButton = () => {
    if (subscribeState !== "disconnected" && subscribeState !== "error") {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={onReconnect}
        style={{
          position: "absolute",
          top: top + 60,
          right: 16,
          backgroundColor: "#FF5722",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          zIndex: 1000,
        }}
      >
        <Text style={{ color: "white", fontSize: 12, fontWeight: "500" }}>
          다시 연결
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SubscriptionStatusIndicator />
      {/* <ReconnectButton /> */}
    </>
  );
}
