import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-blue-500 hover:text-blue-600">
                        MiniSocial
                    </Link>
                    <nav>
                        <Link href="/" className="text-gray-600 hover:text-blue-500">
                            ← ホームに戻る
                        </Link>
                    </nav>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    {/* ロゴ画像 */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="https://supabase.com/dashboard/img/supabase-logo.svg"
                            alt="Supabase Logo"
                            width={200}
                            height={40}
                            className="opacity-80"
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                        MiniSocial について
                    </h1>

                    <p className="text-gray-600 text-center mb-6">
                        MiniSocial は、Next.js と Supabase を使って作られたシンプルな SNS アプリです。
                    </p>

                    <div className="space-y-4 text-gray-700">
                        <h2 className="text-xl font-semibold">✨ 機能</h2>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>投稿の作成・編集・削除</li>
                            <li>いいね機能</li>
                            <li>リアルタイムなUI更新</li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6">🛠️ 技術スタック</h2>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Next.js 16 (App Router)</li>
                            <li>React 19</li>
                            <li>TypeScript</li>
                            <li>Tailwind CSS</li>
                            <li>Supabase (PostgreSQL)</li>
                        </ul>
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            ホームに戻る
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
