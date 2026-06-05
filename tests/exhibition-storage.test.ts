import { describe, expect, it, vi } from 'vitest';
import {
  LOCAL_EXHIBITION_KEY,
  readLocalExhibition,
  writeLocalExhibition
} from '@/lib/local-artwork-storage';
import { sampleExhibition } from '@/lib/sample-data';
import type { Exhibition } from '@/lib/types';

const updatedExhibition: Exhibition = {
  ...sampleExhibition,
  title: '새 전시 제목',
  updatedBy: 'curator@example.com',
  updatedAt: '2026-06-05T00:00:00.000Z'
};

describe('local exhibition storage', () => {
  it('seeds the sample exhibition when local storage is empty', () => {
    const setItem = vi.fn();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => null,
        setItem
      }
    });

    expect(readLocalExhibition()).toEqual(sampleExhibition);
    expect(setItem).toHaveBeenCalledWith(LOCAL_EXHIBITION_KEY, JSON.stringify(sampleExhibition));
  });

  it('reads and writes an updated exhibition', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value)
      }
    });

    writeLocalExhibition(updatedExhibition);

    expect(readLocalExhibition()).toEqual(updatedExhibition);
  });
});
