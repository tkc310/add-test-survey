import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from './TaskList'
import * as actions from '@/lib/actions'

/**
 * TaskListの統合テスト
 * 
 * ユーザーインタラクション（チェックボックス、削除ボタン）と
 * Server Actionsの統合をテストする
 */

// Server Actionsをモック
vi.mock('@/lib/actions', () => ({
  toggleTask: vi.fn(),
  deleteTask: vi.fn(),
}))

describe('TaskList', () => {
  const mockToggleTask = vi.mocked(actions.toggleTask)
  const mockDeleteTask = vi.mocked(actions.deleteTask)
  const mockOnTaskUpdate = vi.fn()

  const mockTasks = [
    {
      id: '1',
      title: 'テストタスク1',
      completed: false,
      createdAt: '2026-10-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'テストタスク2',
      completed: true,
      createdAt: '2026-10-02T00:00:00.000Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('タスクリストを正しくレンダリングする', () => {
    render(<TaskList tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />)

    expect(screen.getByText('テストタスク1')).toBeInTheDocument()
    expect(screen.getByText('テストタスク2')).toBeInTheDocument()
  })

  it('タスクが空の場合にメッセージを表示する', () => {
    render(<TaskList tasks={[]} onTaskUpdate={mockOnTaskUpdate} />)

    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('完了状態のタスクに打ち消し線が表示される', () => {
    render(<TaskList tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />)

    const completedTask = screen.getByText('テストタスク2')
    expect(completedTask).toHaveClass('line-through')
  })

  it('チェックボックスをクリックしてタスクを完了できる', async () => {
    const user = userEvent.setup()
    
    mockToggleTask.mockResolvedValueOnce({
      ...mockTasks[0],
      completed: true,
    })

    render(<TaskList tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />)

    const checkbox = screen.getByLabelText('テストタスク1を完了としてマーク')
    await user.click(checkbox)

    await waitFor(() => {
      expect(mockToggleTask).toHaveBeenCalledWith('1')
      expect(mockOnTaskUpdate).toHaveBeenCalled()
    })
  })

  it('削除ボタンをクリックしてタスクを削除できる', async () => {
    const user = userEvent.setup()
    
    mockDeleteTask.mockResolvedValueOnce(undefined)

    render(<TaskList tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />)

    const deleteButton = screen.getByLabelText('テストタスク1を削除')
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith('1')
      expect(mockOnTaskUpdate).toHaveBeenCalled()
    })
  })
})
