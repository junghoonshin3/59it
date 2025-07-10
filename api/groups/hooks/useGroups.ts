import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMyGroup,
  getGroupMembers,
  getMyGroups,
  joinGroup,
  updateMyGroup,
  uploadGroupImage,
} from "../groups";
import {
  startLocationSharing,
  stopLocationSharing,
} from "@/services/locationService";

export const useMyGroups = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ["myGroups", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const myGroups = await getMyGroups(userId);
      return myGroups;
    },
    enabled: !!userId,
    retry: false,
  });
};

export const useGroupMembers = (groupId: string | null) => {
  return useQuery({
    queryKey: ["groupMember", groupId],
    queryFn: async () => {
      if (!groupId) {
        throw new Error("Group Id is required");
      }
      const groupMember = await getGroupMembers(groupId);
      return groupMember;
    },
    enabled: !!groupId,
  });
};

export const useCreateMyGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMyGroup,
    onSuccess: (data) => {
      // 그룹 생성 성공 시 그룹 리스트 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      return data;
    },
    onError: (error) => {
      console.log("useCreateMyGroup >>>>>>>>>>>>> ", error);
    },
  });
};

export const useUpdateMyGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      return data;
    },
  });
};

export const useGroupImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadGroupImage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      return data;
    },
    onError: (error) => {
      console.log("useGroupImage >>>>>>>>>>>>>> ", error);
    },
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      return data;
    },
    onError: (error) => {
      console.log("useJoinGroup >>>>>>>>>>>>>> ", error);
    },
  });
};

export const useStartSharingLoation = () => {
  return useMutation({
    mutationFn: startLocationSharing,
    retry: 1,
    retryDelay: 1000 * 3,
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useStopSharingLoation = () => {
  return useMutation({
    mutationFn: stopLocationSharing,
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
