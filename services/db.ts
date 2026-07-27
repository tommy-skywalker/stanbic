// Minimal Supabase REST client for syncing the whole app state as a single row.
// No SDK / dependencies — just fetch against the PostgREST endpoint.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase.config';
import { UserProfile, Transaction } from '../types';

export interface AppState {
  user: UserProfile;
  transactions: Transaction[];
}

export interface RemoteState {
  data: AppState;
  updated_at: string;
}

const ROW_ID = 'main';
const TABLE = 'app_state';

export const isSyncEnabled = (): boolean => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const url = () => `${SUPABASE_URL}/rest/v1/${TABLE}`;
const authHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
});

// Returns the shared state row, or null if it doesn't exist yet.
export async function fetchState(): Promise<RemoteState | null> {
  const res = await fetch(`${url()}?id=eq.${ROW_ID}&select=data,updated_at`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`fetchState failed: ${res.status}`);
  const rows = (await res.json()) as RemoteState[];
  return rows[0] ?? null;
}

// Upsert the shared state row (last write wins).
export async function saveState(data: AppState): Promise<void> {
  const res = await fetch(url(), {
    method: 'POST',
    headers: {
      ...authHeaders(),
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({ id: ROW_ID, data, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`saveState failed: ${res.status}`);
}
