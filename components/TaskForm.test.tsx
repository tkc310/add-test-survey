import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'

/**
 * TaskFormの統合テスト
 * 
 * このテストはコンポーネントとその依存関係（Server Actions）の統合をテストする
 * Testing Trophyの中間層で、ユニットテストよりも実際のユーザー操作に近い
 */

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('フォームを正しくレンダリングする', () => {
    render(<TaskForm />)
    
    expect(screen.getByLabelText('新しいタスク')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('タスクを入力...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('タスクを正常に作成できる', async () => {
    const user = userEvent.setup()
    const mockOnTaskCreated = vi.fn().mockResolvedValueOnce(undefined)

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />)

    const input = screen.getByPlaceholderText('タスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, '新しいタスク')
    await user.click(button)

    await waitFor(() => {
      expect(mockOnTaskCreated).toHaveBeenCalledWith('新しいタスク')
    })

    // フォームがクリアされることを確認
    expect(input).toHaveValue('')
  })

  it('空のタイトルでエラーを表示する', async () => {
    const user = userEvent.setup()
    const mockOnTaskCreated = vi.fn()
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />)

    const button = screen.getByRole('button', { name: '追加' })
    await user.click(button)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'タスクのタイトルを入力してください'
    )
    expect(mockOnTaskCreated).not.toHaveBeenCalled()
  })

  it('長すぎるタイトルでエラーを表示する', async () => {
    const user = userEvent.setup()
    const mockOnTaskCreated = vi.fn()
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />)

    const input = screen.getByPlaceholderText('タスクを入力...')
    await user.type(input, 'あ'.repeat(101))

    const button = screen.getByRole('button', { name: '追加' })
    await user.click(button)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'タスクのタイトルは100文字以内である必要があります'
    )
    expect(mockOnTaskCreated).not.toHaveBeenCalled()
  })

  it('送信中はボタンが無効化される', async () => {
    const user = userEvent.setup()
    
    // 長時間かかる処理をシミュレート
    const mockOnTaskCreated = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />)

    const input = screen.getByPlaceholderText('タスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, 'テストタスク')
    await user.click(button)

    // 送信中はボタンが無効化される
    await waitFor(() => {
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('追加中...')
    })
  })

  it('エラー発生時にエラーメッセージを表示する', async () => {
    const user = userEvent.setup()
    
    const mockOnTaskCreated = vi.fn().mockRejectedValueOnce(new Error('サーバーエラー'))

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />)

    const input = screen.getByPlaceholderText('タスクを入力...')
    await user.type(input, 'テストタスク')
    
    const button = screen.getByRole('button', { name: '追加' })
    await user.click(button)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'タスクの作成に失敗しました'
    )
  })
})
