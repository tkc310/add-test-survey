import { describe, it, expect, vi, beforeEach } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { TaskList } from "./TaskList";
import * as actions from "@/lib/actions";

/**
 * TaskListの統合テスト
 *
 * ユーザーインタラクション（チェックボックス、削除ボタン）と
 * Server Actionsの統合をテストする
 */

// Server Actionsをモック
vi.mock("@/lib/actions", () => ({
  toggleTask: vi.fn(),
  deleteTask: vi.fn(),
}));

describe("TaskList", () => {
  const mockToggleTask = vi.mocked(actions.toggleTask);
  const mockDeleteTask = vi.mocked(actions.deleteTask);
  const mockOnTaskUpdate = vi.fn();

  const mockTasks = [
    {
      id: "1",
      title: "テストタスク1",
      completed: false,
      createdAt: "2026-10-01T00:00:00.000Z",
    },
    {
      id: "2",
      title: "テストタスク2",
      completed: true,
      createdAt: "2026-10-02T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("タスクリストを正しくレンダリングする", async () => {
    await render(<TaskList tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />);

    await expect.element(page.getByText("テストタスク1")).toBeInTheDocument();
    await expect.element(page.getByText("テストタスク2")).toBeInTheDocument();
  });

  it("タスクが空の場合にメッセージを表示する", async () => {
    await render(<TaskList tasks={[]} onTaskUpdate={mockOnTaskUpdate} />);

    await expect.element(page.getByText("タスクがありません")).toBeInTheDocument();
  });

  it("完了状態のタスクに打ち消し線が表示される", async () => {
    await render(<TaskList tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />);

    const completedTask = page.getByText("テストタスク2");
    await expect.element(completedTask).toHaveClass("line-through");
  });

  it("チェックボックスをクリックしてタスクを完了できる", async () => {
    mockToggleTask.mockResolvedValueOnce({
      ...mockTasks[0],
      completed: true,
    });

    await render(<TaskList tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />);

    const checkbox = page.getByLabelText("テストタスク1を完了としてマーク");
    await userEvent.click(checkbox);

    await expect.poll(() => mockToggleTask.mock.calls.length).toBe(1);
    expect(mockToggleTask).toHaveBeenCalledWith("1");
    await expect.poll(() => mockOnTaskUpdate.mock.calls.length).toBe(1);
  });

  it("削除ボタンをクリックしてタスクを削除できる", async () => {
    mockDeleteTask.mockResolvedValueOnce(undefined);

    await render(<TaskList tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />);

    const deleteButton = page.getByLabelText("テストタスク1を削除");
    await userEvent.click(deleteButton);

    await expect.poll(() => mockDeleteTask.mock.calls.length).toBe(1);
    expect(mockDeleteTask).toHaveBeenCalledWith("1");
    await expect.poll(() => mockOnTaskUpdate.mock.calls.length).toBe(1);
  });
});
