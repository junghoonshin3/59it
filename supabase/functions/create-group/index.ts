import { createClient } from 'jsr:@supabase/supabase-js@2';
Deno.serve(async (req)=>{
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
  const { name, host_id, display_name, address, longitude, latitude, meeting_date, meeting_time, image_base64, image_filename } = await req.json();
  const invite_code = generateInviteCode();
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  // 1. 먼저 그룹 생성
  const { data: group, error: groupError } = await supabase.from('groups').insert({
    name,
    host_id,
    display_name,
    address,
    longitude,
    latitude,
    meeting_date,
    meeting_time,
    invite_code,
    expires_at
  }).select("*").single();
  if (groupError) {
    return new Response(JSON.stringify({
      error: groupError.message
    }), {
      status: 400
    });
  }
  let imageUrl = null;
  // 2. 이미지가 있다면 업로드
  if (image_base64 && image_filename) {
    const imageBuffer = Uint8Array.from(atob(image_base64), (c)=>c.charCodeAt(0));
    const { data: uploadData, error: uploadError } = await supabase.storage.from('group-images').upload(`${group.id}/${image_filename}`, imageBuffer, {
      contentType: 'image/jpeg'
    });
    if (!uploadError) {
      const { data: publicUrl } = supabase.storage.from('group-images').getPublicUrl(uploadData.path);
      imageUrl = publicUrl.publicUrl;
      // 3. 그룹에 이미지 URL 업데이트
      await supabase.from('groups').update({
        group_image_url: imageUrl
      }).eq('id', group.id);
    }
  }
  // 호스트를 그룹 멤버로 자동 등록
  const { error: memberError } = await supabase.from("group_members").insert([
    {
      group_id: group.id,
      user_id: host_id
    }
  ]);
  if (memberError) {
    console.error('Member insertion error:', memberError);
    // 그룹은 생성되었지만 멤버 추가 실패
    // 롤백을 위해 그룹 삭제를 시도할 수도 있지만, 여기서는 경고만 로그
    console.warn('Group created but failed to add host as member');
    // 선택적으로 그룹 삭제 (롤백)
    // await supabaseClient.from("groups").delete().eq("id", groupData.id);
    return new Response(JSON.stringify({
      error: 'Failed to add host as group member',
      group_id: group.id
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  return new Response(JSON.stringify({
    ...group,
    group_image_url: imageUrl
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
});
// 초대 코드 생성 함수 (사용하지 않지만 유지)
function generateInviteCode() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for(let i = 0; i < 6; i++){
    code += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return code;
}
