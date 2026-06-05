'use client';

import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import {
  getAdminSession,
  listAdminArtworks,
  saveArtwork,
  uploadArtworkImage
} from '@/lib/admin-artwork-store';
import type { AdminSession, ArtworkDraft, ArtworkWithTranslation } from '@/lib/types';
import { AdminShell } from './admin-shell';

const emptyDraft: ArtworkDraft = {
  slug: '',
  artistName: '',
  year: new Date().getFullYear(),
  medium: '',
  dimensions: '',
  location: '',
  imageUrl: '',
  displayOrder: 10,
  isPublished: false,
  translation: {
    locale: 'ko',
    title: '',
    summary: '',
    body: '',
    artistNote: ''
  }
};

export function ArtworkEditor({ artworkId }: { artworkId?: string }) {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [allArtworks, setAllArtworks] = useState<ArtworkWithTranslation[]>([]);
  const [draft, setDraft] = useState<ArtworkDraft>(emptyDraft);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const nextSession = await getAdminSession();
      if (!nextSession) {
        router.replace('/admin/login');
        return;
      }
      const artworks = await listAdminArtworks();
      const currentArtwork = artworkId
        ? artworks.find((artwork) => artwork.id === artworkId)
        : undefined;

      setSession(nextSession);
      setAllArtworks(artworks);
      setDraft(
        currentArtwork
          ? {
              slug: currentArtwork.slug,
              artistName: currentArtwork.artistName,
              year: currentArtwork.year,
              medium: currentArtwork.medium,
              dimensions: currentArtwork.dimensions,
              location: currentArtwork.location,
              imageUrl: currentArtwork.imageUrl,
              displayOrder: currentArtwork.displayOrder,
              isPublished: currentArtwork.isPublished,
              translation: currentArtwork.translation
            }
          : {
              ...emptyDraft,
              displayOrder: (artworks.length + 1) * 10
            }
      );
      setIsLoading(false);
    }

    void load();
  }, [artworkId, router]);

  const title = useMemo(() => (artworkId ? '작품 수정' : '새 작품'), [artworkId]);

  function patchDraft(patch: Partial<ArtworkDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function patchTranslation(patch: Partial<ArtworkDraft['translation']>) {
    setDraft((current) => ({
      ...current,
      translation: {
        ...current.translation,
        ...patch
      }
    }));
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage('');
    try {
      const imageUrl = await uploadArtworkImage(file);
      patchDraft({ imageUrl });
    } catch (uploadError) {
      setMessage(uploadError instanceof Error ? uploadError.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;

    setIsSaving(true);
    setMessage('');
    setFieldErrors({});

    try {
      await saveArtwork({ artworkId, draft, userEmail: session.email });
      router.push('/admin/artworks');
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
        setMessage(saveError instanceof Error ? saveError.message : '저장에 실패했습니다.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (!session) {
    return <main className="px-5 py-16 text-graphite">관리자 세션을 확인 중입니다.</main>;
  }

  return (
    <AdminShell session={session}>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <Link className="focus-ring inline-flex items-center gap-2 text-sm text-moss" href="/admin/artworks">
          <ArrowLeft className="h-4 w-4" />
          작품 관리
        </Link>
        <h1 className="mt-6 font-serif text-5xl text-ink">{title}</h1>

        {isLoading ? <p className="mt-8 text-graphite">불러오는 중입니다.</p> : null}
        {message ? <p className="mt-6 text-sm text-clay">{message}</p> : null}

        <form className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-mist">
              {draft.imageUrl ? (
                <Image
                  alt={draft.translation.title || '작품 이미지'}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  src={draft.imageUrl}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-graphite">
                  <ImagePlus className="h-10 w-10" />
                </div>
              )}
            </div>
            <label className="focus-ring inline-flex h-11 cursor-pointer items-center gap-2 rounded-sm bg-ink px-4 text-sm font-medium text-paper">
              <ImagePlus className="h-4 w-4" />
              {isUploading ? '업로드 중' : '이미지 업로드'}
              <input accept="image/*" className="sr-only" onChange={handleUpload} type="file" />
            </label>
            {fieldErrors.imageUrl ? <FieldError messages={fieldErrors.imageUrl} /> : null}
          </div>

          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                error={fieldErrors['translation.title']?.[0]}
                label="작품 제목"
                onChange={(value) => patchTranslation({ title: value })}
                value={draft.translation.title}
              />
              <TextField
                error={fieldErrors.artistName?.[0]}
                label="작가명"
                onChange={(value) => patchDraft({ artistName: value })}
                value={draft.artistName}
              />
            </div>
            <TextField
              error={fieldErrors.slug?.[0]}
              label="작품 주소"
              onChange={(value) => patchDraft({ slug: value })}
              value={draft.slug}
            />
            <TextArea
              label="요약"
              onChange={(value) => patchTranslation({ summary: value })}
              rows={2}
              value={draft.translation.summary}
            />
            <TextArea
              error={fieldErrors['translation.body']?.[0]}
              label="작품 소개 본문"
              onChange={(value) => patchTranslation({ body: value })}
              rows={7}
              value={draft.translation.body}
            />
            <TextArea
              label="작가 노트"
              onChange={(value) => patchTranslation({ artistNote: value })}
              rows={3}
              value={draft.translation.artistNote}
            />
            <div className="grid gap-5 md:grid-cols-2">
              <NumberField
                label="제작 연도"
                onChange={(value) => patchDraft({ year: value })}
                value={draft.year}
              />
              <NumberField
                label="표시 순서"
                onChange={(value) => patchDraft({ displayOrder: value })}
                value={draft.displayOrder}
              />
              <TextField
                label="재료"
                onChange={(value) => patchDraft({ medium: value })}
                value={draft.medium}
              />
              <TextField
                label="크기"
                onChange={(value) => patchDraft({ dimensions: value })}
                value={draft.dimensions}
              />
              <TextField
                label="위치"
                onChange={(value) => patchDraft({ location: value })}
                value={draft.location}
              />
              <label className="flex items-center gap-3 pt-8 text-sm text-graphite">
                <input
                  checked={draft.isPublished}
                  className="h-5 w-5 accent-clay"
                  onChange={(event) => patchDraft({ isPublished: event.target.checked })}
                  type="checkbox"
                />
                공개
              </label>
            </div>
            <button
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-clay px-5 font-medium text-white disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              <Save className="h-4 w-4" />
              {isSaving ? '저장 중' : '저장'}
            </button>
            <p className="sr-only">{allArtworks.length} artworks loaded</p>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}

function TextField({
  label,
  value,
  onChange,
  error
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-graphite">{label}</span>
      <input
        className="focus-ring mt-2 h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
      {error ? <FieldError messages={[error]} /> : null}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-graphite">{label}</span>
      <input
        className="focus-ring mt-2 h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 outline-none"
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
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
        className="focus-ring mt-2 w-full rounded-sm border border-ink/15 bg-paper px-3 py-3 leading-7 outline-none"
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
      {error ? <FieldError messages={[error]} /> : null}
    </label>
  );
}

function FieldError({ messages }: { messages: string[] }) {
  return <p className="mt-2 text-sm text-clay">{messages[0]}</p>;
}
