import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

type AuthenticatedClient =
  | { client: SupabaseClient<Database>; user: User }
  | { response: NextResponse };

export async function getAuthenticatedClient(request: NextRequest): Promise<AuthenticatedClient> {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!accessToken) {
    return { response: NextResponse.json({ error: "Sign in to sync your learning progress." }, { status: 401 }) };
  }
  if (!url || !key) {
    return { response: NextResponse.json({ error: "Supabase sync is not configured." }, { status: 503 }) };
  }

  const client = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data: { user }, error } = await client.auth.getUser(accessToken);

  if (error || !user) {
    return { response: NextResponse.json({ error: "Your session has expired. Sign in again to sync your progress." }, { status: 401 }) };
  }

  return { client, user };
}
