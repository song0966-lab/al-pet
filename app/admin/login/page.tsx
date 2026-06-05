import Link from 'next/link';
import { AdminLoginForm } from '@/components/admin/admin-login-form';

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 py-12">
      <section className="w-full max-w-md">
        <Link className="focus-ring text-sm text-moss" href="/">
          공개 화면
        </Link>
        <h1 className="mt-8 font-serif text-5xl leading-tight text-ink">관리자 로그인</h1>
        <p className="mt-4 leading-7 text-graphite">
          작품 정보와 공개 상태를 관리합니다.
        </p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
