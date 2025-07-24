import { createClient } from 'jsr:@supabase/supabase-js@2';
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
Deno.serve(async (req)=>{
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { group_id, user_id } = await req.json();
  console.log("group_id >>> ", group_id);
  await supabase.from("group_members").delete().match({
    group_id,
    user_id: user_id
  });
  await supabase.from("group_member_locations").delete().match({
    group_id,
    user_id: user_id
  });
  return new Response(JSON.stringify({
    success: true
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
});
