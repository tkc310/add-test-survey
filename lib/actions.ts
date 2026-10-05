'use server'

import { Task, CreateTaskInput } from './types'

/**
 * タスク管理用のServer Actions
 * 実際のアプリではデータベースを使用するが、ここではメモリ内データで実装
 */

// インメモリのタスクストア（デモ用）
let tasks: Task[] = [
  {
    id: '1',
    title: 'Next.jsのテストを学ぶ',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Vitestでユニットテストを書く',
    completed: true,
    createdAt: new Date().toISOString(),
  },
]

/**
 * タスク一覧を取得
 */
export async function getTasks(): Promise<Task[]> {
  // 実際のAPIコールをシミュレート
  await new Promise((resolve) => setTimeout(resolve, 100))
  return tasks
}

/**
 * タスクを作成
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const newTask: Task = {
    id: Date.now().toString(),
    title: input.title,
    completed: false,
    createdAt: new Date().toISOString(),
  }

  tasks.push(newTask)
  return newTask
}

/**
 * タスクの完了状態を切り替え
 */
export async function toggleTask(id: string): Promise<Task> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const task = tasks.find((t) => t.id === id)
  if (!task) {
    throw new Error('タスクが見つかりません')
  }

  task.completed = !task.completed
  return task
}

/**
 * タスクを削除
 */
export async function deleteTask(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) {
    throw new Error('タスクが見つかりません')
  }

  tasks.splice(index, 1)
}

/**
 * テスト用：タスクをリセット
 */
export async function resetTasks(): Promise<void> {
  tasks = [
    {
      id: '1',
      title: 'Next.jsのテストを学ぶ',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Vitestでユニットテストを書く',
      completed: true,
      createdAt: new Date().toISOString(),
    },
  ]
}
