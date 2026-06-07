'use client';

import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { signInAdmin } from '@/lib/admin-artwork-store';
import { hasSupabaseConfig } from '@/lib/config';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('curator@example.com');
  const [password, setPassword] = useState('curator');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDemoMode = !hasSupabaseConfig();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signInAdmin(email, password);
      router.replace('/admin');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : '로그인에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm text-graphite" htmlFor="email">
          이메일
        </label>
        <input
          className="focus-ring mt-2 h-12 w-full rounded-sm border border-ink/20 bg-paper px-4 outline-none"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
      </div>
      <div>
        <label className="text-sm text-graphite" htmlFor="password">
          비밀번호
        </label>
        <input
          className="focus-ring mt-2 h-12 w-full rounded-sm border border-ink/20 bg-paper px-4 outline-none"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </div>
      {isDemoMode ? (
        <p className="text-sm leading-6 text-moss">Supabase 환경 변수가 없어 로컬 데모 모드로 실행합니다.</p>
      ) : null}
      {error ? <p className="text-sm text-clay">{error}</p> : null}
      <button
        className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-ink px-5 font-medium text-paper disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <LogIn className="h-4 w-4" />
        {isSubmitting ? '확인 중' : '로그인'}
      </button>
    </form>
  );
}
