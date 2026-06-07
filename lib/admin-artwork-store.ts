'use client';

import {
  createArtworkInCollection,
  toggleArtworkPublication,
  updateArtworkInCollection
} from './admin-artwork-actions';
import { artworkBucket, hasSupabaseConfig } from './config';
import {
  LOCAL_ADMIN_SESSION_KEY,
  readLocalArtworks,
  writeLocalArtworks
} from './local-artwork-storage';
import { createSupabaseBrowserClient } from './supabase-client';
import { mapSupabaseArtwork, type SupabaseArtworkRow } from './supabase-mapper';
import type { AdminSession, ArtworkDraft, ArtworkWithTranslation } from './types';

const artworkSelect = `
  id,
  slug,
  artist_name,
  section_id,
  year,
  medium,
  dimensions,
  location,
  image_url,
  display_order,
  is_published,
  created_by,
  updated_by,
  created_at,
  updated_at,
  artwork_translations (
    locale,
    title,
    summary,
    body,
    artist_note
  )
`;

export async function signInAdmin(email: string, password: string): Promise<AdminSession> {
  if (!hasSupabaseConfig()) {
    const session = { email, mode: 'demo' as const };
    window.localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user?.email) {
    throw new Error(error?.message ?? '로그인에 실패했습니다.');
  }

  return { email: data.user.email, mode: 'supabase' };
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!hasSupabaseConfig()) {
    const storedValue = window.localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
    return storedValue ? (JSON.parse(storedValue) as AdminSession) : null;
  }

  const supabase = createSupabaseBrowserClient();
  const { data } = await supabase.auth.getUser();

  return data.user?.email ? { email: data.user.email, mode: 'supabase' } : null;
}

export async function signOutAdmin() {
  if (!hasSupabaseConfig()) {
    window.localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
    return;
  }

  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signOut();
}

export async function listAdminArtworks(): Promise<ArtworkWithTranslation[]> {
  if (!hasSupabaseConfig()) {
    return readLocalArtworks();
  }

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('artworks')
    .select(artworkSelect)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as SupabaseArtworkRow[]).map(mapSupabaseArtwork);
}

export async function saveArtwork(input: {
  artworkId?: string;
  draft: ArtworkDraft;
  userEmail: string;
}): Promise<ArtworkWithTranslation> {
  if (!hasSupabaseConfig()) {
    const existingArtworks = readLocalArtworks();
    const now = new Date().toISOString();
    const result = input.artworkId
      ? updateArtworkInCollection({
          existingArtworks,
          artworkId: input.artworkId,
          draft: input.draft,
          userEmail: input.userEmail,
          now
        })
      : createArtworkInCollection({
          existingArtworks,
          draft: input.draft,
          userEmail: input.userEmail,
          now
        });

    if (!result.success) {
      throw result.error;
    }

    writeLocalArtworks(result.artworks);
    return result.artwork;
  }

  const supabase = createSupabaseBrowserClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const userId = user?.id ?? input.userEmail;
  const now = new Date().toISOString();
  const artworkId = input.artworkId ?? crypto.randomUUID();

  const artworkPayload = {
    id: artworkId,
    slug: input.draft.slug,
    artist_name: input.draft.artistName,
    section_id: input.draft.sectionId ?? null,
    year: input.draft.year,
    medium: input.draft.medium,
    dimensions: input.draft.dimensions,
    location: input.draft.location,
    image_url: input.draft.imageUrl,
    display_order: input.draft.displayOrder,
    is_published: input.draft.isPublished,
    updated_by: userId,
    updated_at: now,
    ...(input.artworkId ? {} : { created_by: userId, created_at: now })
  };

  const { error: artworkError } = await supabase.from('artworks').upsert(artworkPayload);

  if (artworkError) {
    throw new Error(artworkError.message);
  }

  const { error: translationError } = await supabase.from('artwork_translations').upsert({
    artwork_id: artworkId,
    locale: 'ko',
    title: input.draft.translation.title,
    summary: input.draft.translation.summary,
    body: input.draft.translation.body,
    artist_note: input.draft.translation.artistNote
  });

  if (translationError) {
    throw new Error(translationError.message);
  }

  const { data, error } = await supabase
    .from('artworks')
    .select(artworkSelect)
    .eq('id', artworkId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? '작품 저장 후 다시 불러오지 못했습니다.');
  }

  return mapSupabaseArtwork(data as SupabaseArtworkRow);
}

export async function setArtworkPublished(input: {
  artworkId: string;
  isPublished: boolean;
  userEmail: string;
}) {
  if (!hasSupabaseConfig()) {
    const existingArtworks = readLocalArtworks();
    const result = toggleArtworkPublication({
      existingArtworks,
      artworkId: input.artworkId,
      isPublished: input.isPublished,
      userEmail: input.userEmail,
      now: new Date().toISOString()
    });

    if (!result.success) {
      throw result.error;
    }

    writeLocalArtworks(result.artworks);
    return result.artwork;
  }

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from('artworks')
    .update({
      is_published: input.isPublished,
      updated_at: new Date().toISOString()
    })
    .eq('id', input.artworkId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadArtworkImage(file: File): Promise<string> {
  if (!hasSupabaseConfig()) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('이미지를 읽지 못했습니다.'));
      reader.readAsDataURL(file);
    });
  }

  const supabase = createSupabaseBrowserClient();
  const fileExt = file.name.split('.').pop() ?? 'jpg';
  const path = `${crypto.randomUUID()}.${fileExt}`;
  const { error } = await supabase.storage.from(artworkBucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(artworkBucket).getPublicUrl(path);
  return data.publicUrl;
}
