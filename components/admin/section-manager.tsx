'use client';

import { ArrowLeft, Plus, Save, Tags } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { getAdminSession } from '@/lib/admin-artwork-store';
import { listAdminSections, saveSection } from '@/lib/admin-section-store';
import type { AdminSession, Section, SectionDraft } from '@/lib/types';
import { AdminShell } from './admin-shell';

const emptyDraft: SectionDraft = {
  title: '',
  description: '',
  displayOrder: 10
};

export function SectionManager() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>();
  const [draft, setDraft] = useState<SectionDraft>(emptyDraft);
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

      const nextSections = await listAdminSections();
      setSession(nextSession);
      setSections(nextSections);
      setDraft({
        ...emptyDraft,
        displayOrder: (nextSections.length + 1) * 10
      });
      setIsLoading(false);
    }

    void load();
  }, [router]);

  function startNewSection() {
    setSelectedSectionId(undefined);
    setFieldErrors({});
    setMessage('');
    setDraft({
      ...emptyDraft,
      displayOrder: (sections.length + 1) * 10
    });
  }

  function editSection(section: Section) {
    setSelectedSectionId(section.id);
    setFieldErrors({});
    setMessage('');
    setDraft({
      title: section.title,
      description: section.description,
      displayOrder: section.displayOrder
    });
  }

  function patchDraft(patch: Partial<SectionDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;

    setIsSaving(true);
    setFieldErrors({});
    setMessage('');

    try {
      const savedSection = await saveSection({ sectionId: selectedSectionId, draft });
      const nextSections = await listAdminSections();
      setSections(nextSections);
      setSelectedSectionId(savedSection.id);
      setDraft({
        title: savedSection.title,
        description: savedSection.description,
        displayOrder: savedSection.displayOrder
      });
      setMessage('Saved / 저장되었습니다.');
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
        setMessage(saveError instanceof Error ? saveError.message : 'Could not save section / 섹션을 저장하지 못했습니다.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (!session) {
    return <main className="px-5 py-16 text-graphite">Checking admin session / 관리자 세션을 확인하는 중입니다.</main>;
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
            <p className="text-sm uppercase text-moss">Sections / 섹션</p>
            <h1 className="mt-2 font-serif text-5xl text-ink">Section Manager / 섹션 관리</h1>
          </div>
          <button
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-4 text-sm font-medium text-paper md:self-end"
            onClick={startNewSection}
            type="button"
          >
            <Plus className="h-4 w-4" />
            New Section / 새 섹션
          </button>
        </div>

        {isLoading ? <p className="mt-8 text-graphite">Loading / 불러오는 중입니다.</p> : null}
        {message ? <p className="mt-6 text-sm text-clay">{message}</p> : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-3">
            {sections.map((section) => (
              <button
                className={`focus-ring w-full rounded-sm border px-4 py-4 text-left transition ${
                  selectedSectionId === section.id
                    ? 'border-clay bg-clay/10'
                    : 'border-ink/10 bg-paper hover:border-ink/25'
                }`}
                key={section.id}
                onClick={() => editSection(section)}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 font-medium text-ink">
                    <Tags className="h-4 w-4 text-moss" />
                    {section.title}
                  </span>
                  <span className="text-xs text-graphite">#{section.displayOrder}</span>
                </div>
                {section.description ? <p className="mt-2 text-sm leading-6 text-graphite">{section.description}</p> : null}
              </button>
            ))}

            {!isLoading && sections.length === 0 ? (
              <p className="rounded-sm border border-ink/10 bg-paper px-4 py-5 text-sm text-graphite">
                No sections yet / 아직 섹션이 없습니다.
              </p>
            ) : null}
          </div>

          <form className="grid gap-5 rounded-sm border border-ink/10 bg-paper p-5" onSubmit={handleSubmit}>
            <TextField
              error={fieldErrors.title?.[0]}
              label="Section Name / 섹션 이름"
              onChange={(value) => patchDraft({ title: value })}
              value={draft.title}
            />
            <TextArea
              label="Description / 섹션 설명"
              onChange={(value) => patchDraft({ description: value })}
              rows={5}
              value={draft.description}
            />
            <NumberField
              error={fieldErrors.displayOrder?.[0]}
              label="Order / 표시 순서"
              onChange={(value) => patchDraft({ displayOrder: value })}
              value={draft.displayOrder}
            />
            <button
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-clay px-5 font-medium text-white disabled:opacity-60 md:w-fit"
              disabled={isSaving}
              type="submit"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving / 저장 중' : 'Save Section / 섹션 저장'}
            </button>
          </form>
        </div>
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
        className="focus-ring mt-2 h-11 w-full rounded-sm border border-ink/15 bg-white/55 px-3 outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
      {error ? <FieldError message={error} /> : null}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  error
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-graphite">{label}</span>
      <input
        className="focus-ring mt-2 h-11 w-full rounded-sm border border-ink/15 bg-white/55 px-3 outline-none"
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
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
  onChange
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
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
    </label>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-2 text-sm text-clay">{message}</p>;
}
