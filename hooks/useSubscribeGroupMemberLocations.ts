import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/services/supabase/supabaseService";
import { useLocationSharingStore } from "@/store/groups/useLocationSharingStore";
import {
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
} from "@supabase/supabase-js";
import { useLocationStore } from "@/store/useLocationStore";
import { AppState } from "react-native";

export const useSubscribeGroupMemberLocations = () => {
  const {
    currentSharingGroup,
    currentSharingUserId,
    isSharing,
    setSubscribeStatus,
  } = useLocationSharingStore();
  const { updateGroupMemberLocation, insertGroupMember } = useLocationStore();

  const [isConnected, setIsConnected] = useState(false);
  const [currentAppState, setCurrentAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        setCurrentAppState(nextAppState);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isSharing || !currentSharingGroup || currentAppState !== "active")
      return;
    // supabase.realtime.setAuth();
    const newChannel = supabase
      .channel(`member-location-${currentSharingGroup.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_member_locations",
          filter: `group_id=eq.${currentSharingGroup.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const { user_id, group_id, latitude, longitude, update_at } =
              payload.new;
            console.log("INSERT 멤버 위치 데이터 수신 ", payload.new);
            // insertGroupMember({
            //   user_id: user_id,
            //   group_id: group_id,
            //   location: { latitude: latitude, longitude: longitude },
            // });
          } else if (payload.eventType === "UPDATE") {
            const { user_id, latitude, longitude } = payload.new;
            console.log(`UPDATE 멤버 위치 데이터 수신 ${user_id}`, payload.new);

            if (user_id !== currentSharingUserId) {
              updateGroupMemberLocation(user_id, {
                longitude: longitude,
                latitude: latitude,
              });
            }
          }
          console.log("new >> ", payload.new);
        }
      )
      .subscribe((status, error) => {
        console.log(`Subscription status: ${status}, error: ${error}`);

        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          setSubscribeStatus("connected");
          setIsConnected(true);
          console.log("구독 성공");
        } else if (
          status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR ||
          status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT
        ) {
          setSubscribeStatus("error");
          setIsConnected(false);
          console.log("구독 에러/타임아웃 >>> ", error);
          if (error?.message?.startsWith('"Token has expired')) {
            supabase.realtime.setAuth();
          }
        } else if (status === REALTIME_SUBSCRIBE_STATES.CLOSED) {
          setSubscribeStatus("disconnected");
          setIsConnected(false);
          console.log("구독 연결 종료");
        } else {
          setSubscribeStatus("connecting");
        }
      });

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [isSharing, currentAppState, currentSharingGroup]);

  // // 채널 생성 및 구독 로직
  // const createAndSubscribeChannel = useCallback(() => {
  //   if (!currentSharingGroup || channelRef.current) return;

  //   console.log(`Creating channel for group: ${currentSharingGroup.id}`);

  //   channelRef.current = newChannel;
  // }, [
  //   currentSharingGroup,
  //   currentSharingUserId,
  //   setSubscribeStatus,
  //   updateGroupMemberLocation,
  //   insertGroupMember,
  // ]);

  // // 연결 함수
  // const connect = useCallback(() => {
  //   if (!currentSharingGroup) {
  //     console.warn("No sharing group available for connection");
  //     return;
  //   }

  //   if (channelRef.current) {
  //     console.log("Channel already exists, disconnecting first");
  //     disconnect();
  //   }

  //   setSubscribeStatus("connecting");
  //   createAndSubscribeChannel();
  // }, [currentSharingGroup, createAndSubscribeChannel, setSubscribeStatus]);

  // // 연결 해제 함수
  // const disconnect = useCallback(() => {
  //   if (channelRef.current) {
  //     console.log("Disconnecting channel");
  //     channelRef.current.unsubscribe();
  //     channelRef.current = null;
  //     setIsConnected(false);
  //     setSubscribeStatus("disconnected");
  //   }
  // }, [setSubscribeStatus]);

  // // 재연결 함수
  // const reconnect = useCallback(() => {
  //   console.log("Reconnecting...");
  //   disconnect();
  //   setTimeout(() => {
  //     connect();
  //   }, 1000); // 1초 후 재연결
  // }, [connect, disconnect]);

  // // isSharing 상태에 따른 자동 연결/해제
  // useEffect(() => {
  //   if (isSharing && currentSharingGroup && !channelRef.current) {
  //     connect();
  //   } else if (!isSharing && channelRef.current) {
  //     disconnect();
  //   }
  // }, [isSharing, currentSharingGroup, connect, disconnect]);

  // // 컴포넌트 언마운트 시 정리
  // useEffect(() => {
  //   return () => {
  //     disconnect();
  //   };
  // }, [disconnect]);

  // return {
  //   connect,
  //   disconnect,
  //   reconnect,
  // };
};
