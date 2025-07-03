// 3. 수정된 Map 컴포넌트
import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, AppState, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getCurrentPositionAsync,
  restoreLocationSharingOnAppStart,
} from "@/services/locationService";
import { useLocationStore } from "@/store/useLocationStore";
import { useLocationSharingStore } from "@/store/groups/useLocationSharingStore";
import { useSyncCameraWithLocation } from "@/hooks/useSyncCameraWithLocation";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import GroupListContent from "@/components/GroupListContent";
import GroupDetailContent from "@/components/GroupDetailContent";
import CreateOrJoinGroupSheet from "@/components/CreateOrJoinGroupSheet";
import CommonModal from "@/components/commonpopup";
import NotificationBell from "@/components/NotificationBell";
import { ImageButton } from "@/components/ImageButton";
import { CustomMarkerView } from "@/components/CustomMarkerView";
import BottomSheet from "@gorhom/bottom-sheet";
import { StyleProps } from "react-native-reanimated";
import { useWatchLocation } from "@/hooks/useWatchLocation";
import ProfileButton from "@/components/ProfileButton";
import { useUser, useUserProfile } from "@/api/auth/hooks/useAuth";
import { Group } from "@/api/groups/types";
import {
  useGroupMembers,
  useMyGroups,
  useStartSharingLoation,
  useStopSharingLoation,
} from "@/api/groups/hooks/useGroups";

export default function Map() {
  // refs
  const mapRef = useRef<MapView>(null);
  const groupRef = useRef<BottomSheet>(null);
  const createRef = useRef<BottomSheet>(null);

  // states
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isModalShareLoc, setIsModalShareLoc] = useState(false);
  const [showBackgroundButton, setShowBackgroundButton] = useState(true);

  // stores
  const { data: user } = useUserProfile();
  const { data: myGroups, isLoading } = useMyGroups(user?.id);
  const { data: groupMemberProfiles, isLoading: isGroupMemberLoading } =
    useGroupMembers(selectedGroup?.id);
  const { location, setLocation } = useLocationStore();
  const { currentSharingGroupId, isSharing } = useLocationSharingStore();
  const startSharingLocationMutation = useStartSharingLoation();
  const stopSharingLocationMutation = useStopSharingLoation();
  const insets = useSafeAreaInsets();

  // 위치 변경시 카메라 위치 설정
  useSyncCameraWithLocation(mapRef);

  // 포그라운드 시 위치변경 훅
  useWatchLocation((location) => {
    console.log("포그라운드에서 위치변경 >>>>>>>>>>> ", location.coords);
    setLocation(location.coords);
  });

  // 앱 시작 시 위치 공유 복구
  useEffect(() => {
    const initializeLocationSharing = async () => {
      if (user?.id) {
        const result = await restoreLocationSharingOnAppStart(user.id);
        if (result.restored) {
          console.log(`위치 공유 복구됨 - 그룹 ${result.groupId}`);

          // 복구된 그룹을 선택된 그룹으로 설정
          const restoredGroup = myGroups?.find((g) => g.id === result.groupId);
          if (restoredGroup) {
            setSelectedGroup(restoredGroup);
          }

          if (result.restarted) {
            console.log("백그라운드 위치 추적이 재시작되었습니다.");
          }
        }
      }
    };

    initializeLocationSharing();
  }, [user?.id, myGroups]);

  // 앱 상태 변경 감지
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === "active" && user?.id) {
        // 앱이 포그라운드로 돌아올 때 위치 공유 상태 확인
        await restoreLocationSharingOnAppStart(user.id);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [user?.id]);

  // 📍 현재 위치로 카메라 이동
  const getCurrentLocation = async () => {
    const currentPosition = await getCurrentPositionAsync();
    if (currentPosition && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // 👥 그룹 클릭 시 상세 정보 로드
  const onGroupClick = async (selectedGroup: Group) => {
    setSelectedGroup(selectedGroup);
    groupRef.current?.snapToIndex(2);
  };

  // 📤 위치 공유 시작 요청
  const handleConfirmStartSharing = async () => {
    if (!selectedGroup || !user) return;
    try {
      const result = await startSharingLocationMutation.mutateAsync({
        groupId: selectedGroup.id,
        userId: user.id,
      });
      if (result.success) {
        console.log("위치 공유 시작됨");
        // 성공 시 UI 피드백 가능
        groupRef.current?.snapToIndex(0);
        // setIsModalShareLoc(false);
      } else {
        console.error("위치 공유 시작 실패:", result.error);
        // 실패 시 사용자에게 알림 표시
      }
    } catch (error) {
      console.error("위치 공유 시작 오류:", error);
    }
  };

  // 📥 위치 공유 중지 요청
  const handlePressStopSharing = async () => {
    if (!user) return;

    try {
      const result = await stopSharingLocationMutation.mutateAsync(user.id);
      if (result.success) {
        console.log("위치 공유 중지됨");
      } else {
        console.error("위치 공유 중지 실패:", result.error);
      }
    } catch (error) {
      console.error("위치 공유 중지 오류:", error);
    }
  };

  // 현재 공유 중인 그룹 확인
  const isGroupCurrentlySharing = (groupId: string) => {
    return isSharing && currentSharingGroupId === groupId;
  };

  type CustomBackgroundProps = StyleProps & {
    children?: React.ReactNode;
  };

  const CustomBackground = ({ style, children }: CustomBackgroundProps) => {
    return (
      <>
        <View style={[{ ...style }]} />
        <View style={{ position: "absolute", top: -55, right: 32 }}>
          {children}
        </View>
      </>
    );
  };

  if (!location) return null;

  return (
    <View className="flex-1">
      {/* 지도 */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsBuildings={false}
        scrollDuringRotateOrZoomEnabled={false}
        rotateEnabled={false}
        zoomTapEnabled={false}
        toolbarEnabled={false}
        maxZoomLevel={25}
        minZoomLevel={8}
      >
        <CustomMarkerView
          coordinate={location}
          imageUrl={user?.profile_image}
          name={user?.nickname}
        />
      </MapView>

      {/* 그룹 목록/상세 바텀시트 */}
      <CustomBottomSheet
        ref={groupRef}
        snapPoints={[40, 200, "90%"]}
        index={1}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        onChange={(index) => {
          setShowBackgroundButton(index === 0 || index === 1);
        }}
        backgroundComponent={(props) => (
          <CustomBackground {...props}>
            <CommonModal
              visible={isModalShareLoc}
              cancelText={"아니요"}
              confirmText={"네"}
              title={"위치공유"}
              description={
                "참여 중인 모임의 구성원들과\n나의 위치를 실시간으로 공유합니다.\n위치 공유를 시작하시겠어요?"
              }
              onConfirm={() => {
                handleConfirmStartSharing();
                setIsModalShareLoc(false);
              }}
              onCancel={() => {
                setIsModalShareLoc(false);
              }}
            />
            {showBackgroundButton ? (
              <ImageButton
                image={require("@/assets/images/my_location.png")}
                onPress={getCurrentLocation}
                className="shadow-lg"
                backgroundColor="bg-[#0075FF]"
                size={50}
              />
            ) : null}
          </CustomBackground>
        )}
      >
        <GroupListContent
          loading={isLoading}
          groups={myGroups ?? []}
          onClickGroupItem={onGroupClick}
          addGroup={() => {
            groupRef.current?.close();
            createRef.current?.expand();
          }}
          selectedGroupId={selectedGroup?.id}
        />

        <GroupDetailContent
          loading={
            startSharingLocationMutation.isPending ||
            stopSharingLocationMutation.isPending
          }
          selectedGroup={selectedGroup}
          members={groupMemberProfiles ?? []}
          onShareLocationStart={() => {
            setIsModalShareLoc(true);
          }}
          onShareLocationStop={handlePressStopSharing}
          isCurrentlySharing={
            selectedGroup ? isGroupCurrentlySharing(selectedGroup.id) : false
          }
        />
      </CustomBottomSheet>

      {/* 그룹 생성/참여 바텀시트 */}
      <CustomBottomSheet
        index={-1}
        ref={createRef}
        enablePanDownToClose={false}
      >
        <CreateOrJoinGroupSheet
          onClose={() => {
            createRef.current?.close();
            groupRef.current?.snapToIndex(1);
          }}
        />
      </CustomBottomSheet>

      {/* 알림 */}
      <NotificationBell
        top={insets.top + 5}
        hasNotification
        onPress={() => {}}
      />
      <ProfileButton
        profileImage={user?.profile_image}
        top={insets.top + 5}
        className="left-4"
        onPress={() => {
          router.navigate("/profile");
        }}
      />
    </View>
  );
}
