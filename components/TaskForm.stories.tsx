import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { TaskForm } from "@/components/TaskForm";

/**
 * タスク作成フォームの見た目と入力状態
 */
const meta = {
  title: "Components/TaskForm",
  component: TaskForm,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onTaskCreated: fn().mockResolvedValue(undefined),
  },
} satisfies Meta<typeof TaskForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 初期表示（未入力） */
export const Default: Story = {};

/** テキスト入力済みの状態 */
export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("新しいタスク");
    await userEvent.type(input, "牛乳を買う");
    await expect(input).toHaveValue("牛乳を買う");
  },
};

/** 入力欄にフォーカスした状態 */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("新しいタスク");
    await userEvent.click(input);
    await expect(input).toHaveFocus();
  },
};

/** 空のまま送信したあとのバリデーションエラー */
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "追加" }));
    await expect(canvas.getByRole("alert")).toHaveTextContent("タスクのタイトルを入力してください");
  },
};

/** 送信成功後（入力がクリアされた状態） */
export const AfterSubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("新しいタスク");
    await userEvent.type(input, "散歩する");
    await userEvent.click(canvas.getByRole("button", { name: "追加" }));
    await expect(args.onTaskCreated).toHaveBeenCalledWith("散歩する");
    await expect(input).toHaveValue("");
  },
};

/** 送信中（ボタン無効・ラベル変更） */
export const Submitting: Story = {
  args: {
    // 送信中表示を維持するため、解決しない Promise を返す
    onTaskCreated: fn(async () => {
      await new Promise(() => {});
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("新しいタスク"), "読み込み中のタスク");
    await userEvent.click(canvas.getByRole("button", { name: "追加" }));
    // 状態更新後のラベルを待つ
    const button = await canvas.findByRole("button", { name: "追加中..." });
    await expect(button).toBeDisabled();
  },
};
