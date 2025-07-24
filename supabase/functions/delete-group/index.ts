import { createClient } from 'jsr:@supabase/supabase-js@2';
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
Deno.serve(async (req)=>{
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { group_id } = await req.json();
  console.log("group_id >>> ", group_id);
  // 삭제 실행 (RPC)
  const { error: deleteError } = await supabase.rpc("delete_group_transaction", {
    p_group_id: group_id
  });
  console.log("deleteError >>> ", deleteError);
  if (deleteError) {
    return new Response(`삭제 실패: ${deleteError.message}`, {
      status: 500
    });
  }
  return new Response(JSON.stringify({
    success: true
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
});
