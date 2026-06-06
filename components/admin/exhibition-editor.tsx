'use client';

import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { getAdminSession } from '@/lib/admin-artwork-store';
import { getAdminExhibition, saveExhibition } from '@/lib/admin-exhibition-store';
import type { AdminSession, Exhibition, ExhibitionDraft } from '@/lib/types';
import { AdminShell } from './admin-shell';

export function ExhibitionEditor() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [currentExhibition, setCurrentExhibition] = useState<Exhibition | null>(null);
  const [draft, setDraft] = useState<ExhibitionDraft | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const nextSession = await getAdminSession();
      if (!nextSession) {
        router.replace('/admin/login');
        return;
      }

      const exhibition = await getAdminExhibition();
      setSession(nextSession);
      setCurrentExhibition(exhibition);
      setDraft(toDraft(exhibition));
      setIsLoading(false);
    }

    void load();
  }, [router]);

  function patchDraft(patch: Partial<ExhibitionDraft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !currentExhibition || !draft) return;

    setIsSaving(true);
    setMessage('');
    setFieldErrors({});

    try {
      const savedExhibition = await saveExhibition({
        currentExhibition,
        draft,
        userEmail: session.email
      });
      setCurrentExhibition(savedExhibition);
      setDraft(toDraft(savedExhibition));
      setMessage('저장되었습니다. 공개 홈의 전시 안내에도 반영됩니다.');
      router.refresh();
    } catch (saveError) {
      if (
        saveError &&
        typeof saveError === 'object' &&
        'flatten' in saveError &&
        typeof saveError.flatten === 'function'
      ) {
        setFieldErrors(saveError.flatten().fieldErrors);
      } else {
        setMessage(saveError instanceof Error ? saveError.message : '전시 안내를 저장하지 못했습니다.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (!session) {
    return <main className="px-5 py-16 text-graphite">관리자 세션을 확인하는 중입니다.</main>;
  }

  return (
    <AdminShell session={session}>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <Link className="focus-ring inline-flex items-center gap-2 text-sm text-moss" href="/admin/artworks">
          <ArrowLeft className="h-4 w-4" />
          Artwork Admin / 작품 관리
        </Link>
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase text-moss">Exhibition Guide / 전시 안내</p>
            <h1 className="mt-2 font-serif text-5xl text-ink">전시 안내 관리</h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-graphite">
            관람객 홈에 보이는 전시 소개와 기본 안내 정보를 수정합니다.
          </p>
        </div>

        {isLoading ? <p className="mt-8 text-graphite">불러오는 중입니다.</p> : null}
        {message ? <p className="mt-6 text-sm text-clay">{message}</p> : null}

        {draft ? (
          <form className="mt-8 grid gap-6 rounded-sm border border-ink/10 bg-paper p-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                error={fieldErrors.title?.[0]}
                label="Title / 전시명"
                onChange={(value) => patchDraft({ title: value })}
                value={draft.title}
              />
              <TextField
                label="Subtitle / 부제"
                onChange={(value) => patchDraft({ subtitle: value })}
                value={draft.subtitle}
              />
              <TextField
                error={fieldErrors.venue?.[0]}
                label="Venue / 장소"
                onChange={(value) => patchDraft({ venue: value })}
                value={draft.venue}
              />
              <TextField
                error={fieldErrors.viewingHours?.[0]}
                label="Hours / 관람 시간"
                onChange={(value) => patchDraft({ viewingHours: value })}
                value={draft.viewingHours}
              />
              <TextField
                error={fieldErrors.startsAt?.[0]}
                label="Start Date / 시작일"
                onChange={(value) => patchDraft({ startsAt: value })}
                type="date"
                value={draft.startsAt}
              />
              <TextField
                error={fieldErrors.endsAt?.[0]}
                label="End Date / 종료일"
                onChange={(value) => patchDraft({ endsAt: value })}
                type="date"
                value={draft.endsAt}
              />
            </div>

            <TextArea
              error={fieldErrors.visitorNotice?.[0]}
              label="Notice / 안내 문구"
              onChange={(value) => patchDraft({ visitorNotice: value })}
              rows={3}
              value={draft.visitorNotice}
            />
            <TextArea
              error={fieldErrors.introduction?.[0]}
              label="Introduction / 전시 소개"
              onChange={(value) => patchDraft({ introduction: value })}
              rows={4}
              value={draft.introduction}
            />
            <TextArea
              error={fieldErrors.curatorNote?.[0]}
              label="Curator Note / 큐레이터 노트"
              onChange={(value) => patchDraft({ curatorNote: value })}
              rows={4}
              value={draft.curatorNote}
            />
            <TextField
              error={fieldErrors.heroImageUrl?.[0]}
              label="Hero Image URL / 대표 이미지 주소"
              onChange={(value) => patchDraft({ heroImageUrl: value })}
              value={draft.heroImageUrl}
            />

            <label className="flex items-center gap-3 text-sm text-graphite">
              <input
                checked={draft.isPublished}
                className="h-5 w-5 accent-clay"
                onChange={(event) => patchDraft({ isPublished: event.target.checked })}
                type="checkbox"
              />
              Published / 공개
            </label>

            <button
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-clay px-5 font-medium text-white disabled:opacity-60 md:w-fit"
              disabled={isSaving}
              type="submit"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving / 저장 중' : 'Save / 저장'}
            </button>
          </form>
        ) : null}
      </section>
    </AdminShell>
  );
}

function toDraft(exhibition: Exhibition): ExhibitionDraft {
  return {
    title: exhibition.title,
    subtitle: exhibition.subtitle,
    venue: exhibition.venue,
    startsAt: exhibition.startsAt,
    endsAt: exhibition.endsAt,
    viewingHours: exhibition.viewingHours,
    visitorNotice: exhibition.visitorNotice,
    heroImageUrl: exhibition.heroImageUrl,
    introduction: exhibition.introduction,
    curatorNote: exhibition.curatorNote,
    isPublished: exhibition.isPublished
  };
}

function TextField({
  label,
  value,
  onChange,
  error,
  type = 'text'
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-graphite">{label}</span>
      <input
        className="focus-ring mt-2 h-11 w-full rounded-sm border border-ink/15 bg-white/55 px-3 outline-none"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
      {error ? <FieldError message={error} /> : null}
    </label>
  );
}

function TextArea({
  label,
  value,
  rows,
  onChange,
  error
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-graphite">{label}</span>
      <textarea
        className="focus-ring mt-2 w-full rounded-sm border border-ink/15 bg-white/55 px-3 py-3 leading-7 outline-none"
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
      {error ? <FieldError message={error} /> : null}
    </label>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-2 text-sm text-clay">{message}</p>;
}
