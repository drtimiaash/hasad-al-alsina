import { supabase } from '../lib/supabase';

// ─── Accounting Entries ────────────────────────────────────

export interface AccountingEntryData {
    date: string;
    sins: Record<string, boolean>;
    note: string;
    score: number;
}

export async function saveAccountingEntry(entry: AccountingEntryData): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('accounting_entries')
        .upsert({
            user_id: user.id,
            date: entry.date,
            sins: entry.sins,
            note: entry.note,
            score: entry.score,
        }, { onConflict: 'user_id,date' });

    if (error) {
        console.error('Error saving accounting entry:', error);
        return false;
    }
    return true;
}

export async function getAccountingEntries(limit = 30): Promise<AccountingEntryData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('accounting_entries')
        .select('date, sins, note, score')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching accounting entries:', error);
        return [];
    }
    return data || [];
}

// ─── Challenge Completions ─────────────────────────────────

export async function saveChallengeCompletions(date: string, challengeIds: string[]): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('challenge_completions')
        .upsert({
            user_id: user.id,
            date,
            challenge_ids: challengeIds,
        }, { onConflict: 'user_id,date' });

    if (error) {
        console.error('Error saving challenge completions:', error);
        return false;
    }
    return true;
}

export async function getChallengeCompletions(date: string): Promise<string[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('challenge_completions')
        .select('challenge_ids')
        .eq('user_id', user.id)
        .eq('date', date)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching challenge completions:', error);
    }
    return data?.challenge_ids || [];
}

// ─── Daily Challenge Acceptance ────────────────────────────

export async function saveDailyChallengeAcceptance(date: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('daily_challenge_acceptances')
        .upsert({
            user_id: user.id,
            date,
        }, { onConflict: 'user_id,date' });

    if (error) {
        console.error('Error saving daily challenge acceptance:', error);
        return false;
    }
    return true;
}

export async function getDailyChallengeAcceptance(date: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
        .from('daily_challenge_acceptances')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', date)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily challenge acceptance:', error);
    }
    return !!data;
}

// ─── User Profile ──────────────────────────────────────────

export async function getUserProfile(): Promise<{ display_name: string; email: string } | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('display_name, email')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data;
}
