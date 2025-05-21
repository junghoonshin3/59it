import { supabase } from "./supabaseService";
import { decode } from "base64-arraybuffer";

//  Storage에 업로드
export const uploadImageToSupabase = async (
  base64: string,
  groupId: string
): Promise<string | null> => {
  const path = `${groupId}/image.jpg`;

  const { error } = await supabase.storage
    .from("group-images") // 버킷 이름
    .upload(path, decode(base64), {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error("이미지 업로드 실패:", error.message);
    return null;
  }

  const { data } = supabase.storage.from("group-images").getPublicUrl(path);
  return data.publicUrl;
};
