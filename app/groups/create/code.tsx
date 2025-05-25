import ConfirmButton from "@/components/confirmbutton";
import FormField from "@/components/formfield";
import InviteCodeText from "@/components/InviteCodeText";
import Topbar from "@/components/topbar";
import { uploadImageToSupabase } from "@/services/supabase/storageService";
import { updateGroup } from "@/services/supabase/supabaseService";
import { pickImage } from "@/utils/pickImage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text } from "react-native";

export default function CreateCode() {
  const router = useRouter();
  const [imageNm, setImageNm] = useState("");
  const { invite_code, group_id } = useLocalSearchParams<{
    invite_code: string;
    group_id: string;
  }>();

  const handlePickedImage = async () => {
    const image = await pickImage();
    if (!image) return;

    const image_url = await uploadImageToSupabase(image.base64, group_id);
    if (image_url) {
      setImageNm(image.name);
      await updateGroup(group_id, image_url);
    }
  };

  return (
    <View className="flex-1 bg-background px-[32px]">
      <Topbar
        title="코드생성"
        onPress={router.back}
        image={require("@/assets/images/back_button.png")}
      />
      <Text className="text-[14px] text-[#9EA3B2] text-regular mt-[40px] leading-[22px]">{`초대 코드가 생성되었습니다!\n코드를 친구에게 공유하세요.\n해당 코드는 24시간 유지됩니다.`}</Text>
      <InviteCodeText code={invite_code} className="mt-[40px]" />
      <FormField
        className="mt-[20px]"
        label="모임사진"
        placeholder="모임을 대표하는 사진을 설정해보세요."
        icon={require("@/assets/images/group_image.png")}
        readOnly={true}
        error=""
        value={imageNm}
        onPress={handlePickedImage}
      />
      <View className="flex-1" />
      <ConfirmButton
        className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
        title="친구에게 공유하기"
        onPress={() => router.dismissAll()}
      />
    </View>
  );
}
