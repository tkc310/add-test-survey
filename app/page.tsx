import { TaskManager } from '@/components/TaskManager'
import { getTasks } from '@/lib/actions'

/**
 * メインページ
 * タスク管理アプリケーションのホームページ
 */
export default async function Home() {
  const tasks = await getTasks()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            タスク管理アプリ
          </h1>
          <p className="text-gray-600 mb-8">
            Next.jsのテストベストプラクティスを学ぶためのサンプルアプリ
          </p>

          <TaskManager initialTasks={tasks} />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            このアプリについて
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ <strong>ユニットテスト</strong>: バリデーション関数のテスト</li>
            <li>✅ <strong>統合テスト</strong>: コンポーネントとServer Actionsの統合テスト</li>
            <li>✅ <strong>E2Eテスト</strong>: ユーザーフローの完全なテスト</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
