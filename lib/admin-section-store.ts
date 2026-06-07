'use client';

import { createSectionInCollection, updateSectionInCollection } from './admin-section-actions';
import { hasSupabaseConfig } from './config';
import { readLocalSections, writeLocalSections } from './local-artwork-storage';
import { createSupabaseBrowserClient } from './supabase-client';
import { mapSupabaseSection, type SupabaseSectionRow } from './supabase-mapper';
import type { Section, SectionDraft } from './types';

const sectionSelect = 'id, title, description, display_order';

export async function listAdminSections(): Promise<Section[]> {
  if (!hasSupabaseConfig()) {
    return readLocalSections();
  }

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('sections')
    .select(sectionSelect)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as SupabaseSectionRow[]).map(mapSupabaseSection);
}

export async function saveSection(input: {
  sectionId?: string;
  draft: SectionDraft;
}): Promise<Section> {
  if (!hasSupabaseConfig()) {
    const existingSections = readLocalSections();
    const result = input.sectionId
      ? updateSectionInCollection({
          existingSections,
          sectionId: input.sectionId,
          draft: input.draft
        })
      : createSectionInCollection({
          existingSections,
          draft: input.draft
        });

    if (!result.success) {
      throw result.error;
    }

    writeLocalSections(result.sections);
    return result.section;
  }

  const supabase = createSupabaseBrowserClient();
  const sectionId = input.sectionId ?? crypto.randomUUID();
  const { data, error } = await supabase
    .from('sections')
    .upsert({
      id: sectionId,
      title: input.draft.title.trim(),
      description: input.draft.description.trim(),
      display_order: input.draft.displayOrder
    })
    .select(sectionSelect)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not save section / 섹션을 저장하지 못했습니다.');
  }

  return mapSupabaseSection(data as SupabaseSectionRow);
}
