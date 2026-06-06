'use client';

import { updateExhibitionDetails } from './admin-exhibition-actions';
import { hasSupabaseConfig } from './config';
import { readLocalExhibition, writeLocalExhibition } from './local-artwork-storage';
import { sampleExhibition } from './sample-data';
import { createSupabaseBrowserClient } from './supabase-client';
import { mapSupabaseExhibition, type SupabaseExhibitionRow } from './supabase-mapper';
import type { Exhibition, ExhibitionDraft } from './types';

const exhibitionSelect = `
  id,
  title,
  subtitle,
  venue,
  starts_at,
  ends_at,
  viewing_hours,
  visitor_notice,
  hero_image_url,
  introduction,
  curator_note,
  is_published,
  created_by,
  updated_by,
  created_at,
  updated_at
`;

export async function getAdminExhibition(): Promise<Exhibition> {
  if (!hasSupabaseConfig()) {
    return readLocalExhibition();
  }

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('exhibitions')
    .select(exhibitionSelect)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data
    ? mapSupabaseExhibition(data as SupabaseExhibitionRow)
    : {
        ...sampleExhibition,
        id: crypto.randomUUID(),
        createdBy: null,
        updatedBy: null
      };
}

export async function saveExhibition(input: {
  currentExhibition: Exhibition;
  draft: ExhibitionDraft;
  userEmail: string;
}): Promise<Exhibition> {
  const now = new Date().toISOString();
  const result = updateExhibitionDetails({
    currentExhibition: input.currentExhibition,
    draft: input.draft,
    userEmail: input.userEmail,
    now
  });

  if (!result.success) {
    throw result.error;
  }

  if (!hasSupabaseConfig()) {
    writeLocalExhibition(result.exhibition);
    return result.exhibition;
  }

  const supabase = createSupabaseBrowserClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const userId = user?.id ?? input.userEmail;

  const { data, error } = await supabase
    .from('exhibitions')
    .upsert({
      id: result.exhibition.id,
      title: result.exhibition.title,
      subtitle: result.exhibition.subtitle,
      venue: result.exhibition.venue,
      starts_at: result.exhibition.startsAt,
      ends_at: result.exhibition.endsAt,
      viewing_hours: result.exhibition.viewingHours,
      visitor_notice: result.exhibition.visitorNotice,
      hero_image_url: result.exhibition.heroImageUrl,
      introduction: result.exhibition.introduction,
      curator_note: result.exhibition.curatorNote,
      is_published: result.exhibition.isPublished,
      created_by: result.exhibition.createdBy ?? userId,
      updated_by: userId,
      updated_at: now
    })
    .select(exhibitionSelect)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? '전시 안내를 저장하지 못했습니다.');
  }

  return mapSupabaseExhibition(data as SupabaseExhibitionRow);
}
