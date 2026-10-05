/**
 * タスク管理用の型定義
 */

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export interface CreateTaskInput {
  title: string
}
