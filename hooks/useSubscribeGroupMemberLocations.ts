import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase/supabaseService";
import { useLocationSharingStore } from "@/store/groups/useLocationSharingStore";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { useLocationStore } from "@/store/useLocationStore";

export const useSubscribeGroupMemberLocations = () => {
  const {
    currentSharingGroup,
    currentSharingUserId,
    isSharing,
    setIsSubscribe,
  } = useLocationSharingStore();
  const { updateGroupMemberLocation, insertGroupMember } = useLocationStore();
  useEffect(() => {
    if (!isSharing || !currentSharingGroup) return;
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
          //구독!!!
          console.log("new >> ", payload.new);
        }
      );
    newChannel.subscribe((status, error) => {
      console.log(`status : ${status}, error : ${error}`);
      setIsSubscribe(status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
    });
    return () => {
      newChannel.unsubscribe();
    };
  }, [isSharing, currentSharingGroup]);
};
