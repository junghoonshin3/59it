import { useEffect } from "react";
import { supabase } from "@/services/supabase/supabaseService";
import { MemberLocation } from "@/types/types";

export const useSubscribeGroupMemberLocations = (groupId: string) => {
  // const { setMemberLocation, resetGroupLocations } =
  //   useGroupMemberLocationStore();
  // useEffect(() => {
  //   if (!groupId) return;
  //   const channel = supabase
  //     .channel(`locations-${groupId}`)
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "group_member_locations",
  //         filter: `group_id=eq.${groupId}`,
  //       },
  //       (payload) => {
  //         const location = payload.new as MemberLocation;
  //         if (location) {
  //           // setMemberLocation(groupId, location);
  //         }
  //       }
  //     )
  //     .subscribe();
  //   return () => {
  //     supabase.removeChannel(channel);
  //     resetGroupLocations(groupId); // 구독 해제 시 초기화
  //   };
  // }, [groupId]);
};
