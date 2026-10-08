import { describe, it, expect, vi, beforeEach } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { TaskForm } from "./TaskForm";

/**
 * TaskFormの統合テスト
 *
 * このテストはコンポーネントとその依存関係（Server Actions）の統合をテストする
 * Testing Trophyの中間層で、ユニットテストよりも実際のユーザー操作に近い
 */

describe("TaskForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("フォームを正しくレンダリングする", async () => {
    await render(<TaskForm />);

    await expect.element(page.getByLabelText("新しいタスク")).toBeInTheDocument();
    await expect.element(page.getByPlaceholder("タスクを入力...")).toBeInTheDocument();
    await expect.element(page.getByRole("button", { name: "追加" })).toBeInTheDocument();
  });

  it("タスクを正常に作成できる", async () => {
    const mockOnTaskCreated = vi.fn().mockResolvedValueOnce(undefined);

    await render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const input = page.getByPlaceholder("タスクを入力...");
    const button = page.getByRole("button", { name: "追加" });

    await userEvent.fill(input, "新しいタスク");
    await userEvent.click(button);

    await expect.poll(() => mockOnTaskCreated.mock.calls.length).toBe(1);
    expect(mockOnTaskCreated).toHaveBeenCalledWith("新しいタスク");

    // フォームがクリアされることを確認
    await expect.element(input).toHaveValue("");
  });

  it("空のタイトルでエラーを表示する", async () => {
    const mockOnTaskCreated = vi.fn();
    await render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const button = page.getByRole("button", { name: "追加" });
    await userEvent.click(button);

    await expect
      .element(page.getByRole("alert"))
      .toHaveTextContent("タスクのタイトルを入力してください");
    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  it("長すぎるタイトルでエラーを表示する", async () => {
    const mockOnTaskCreated = vi.fn();
    await render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const input = page.getByPlaceholder("タスクを入力...");
    await userEvent.fill(input, "あ".repeat(101));

    const button = page.getByRole("button", { name: "追加" });
    await userEvent.click(button);

    await expect
      .element(page.getByRole("alert"))
      .toHaveTextContent("タスクのタイトルは100文字以内である必要があります");
    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  it("送信中はボタンが無効化される", async () => {
    // 送信完了をテスト側で制御し、loading 中の UI を確実に検証する
    let resolveSubmit!: () => void;
    const mockOnTaskCreated = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    await render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    await userEvent.fill(page.getByPlaceholder("タスクを入力..."), "テストタスク");
    await userEvent.click(page.getByRole("button", { name: "追加" }));

    // ラベルが「追加中...」に変わり、無効化されていることを確認
    const loadingButton = page.getByRole("button", { name: "追加中..." });
    await expect.element(loadingButton).toBeDisabled();

    resolveSubmit();
    await expect.element(page.getByRole("button", { name: "追加" })).toBeEnabled();
  });

  it("エラー発生時にエラーメッセージを表示する", async () => {
    const mockOnTaskCreated = vi.fn().mockRejectedValueOnce(new Error("サーバーエラー"));

    await render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const input = page.getByPlaceholder("タスクを入力...");
    await userEvent.fill(input, "テストタスク");

    const button = page.getByRole("button", { name: "追加" });
    await userEvent.click(button);

    await expect.element(page.getByRole("alert")).toHaveTextContent("タスクの作成に失敗しました");
  });
});
