import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { Button } from "@/components/Button";

/**
 * TaskForm / TaskList で使う Button の見た目バリエーション
 */
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "danger"],
      description: "見た目の種別",
    },
    disabled: {
      control: "boolean",
      description: "無効状態",
    },
    children: {
      control: "text",
      description: "ボタンラベル",
    },
  },
  args: {
    onClick: fn(),
    children: "ボタン",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** タスク追加などで使うデフォルト */
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "追加",
  },
};

/** 削除など危険な操作向け */
export const Danger: Story = {
  args: {
    variant: "danger",
    children: "削除",
  },
};

/** 送信中など操作できない状態 */
export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "追加中...",
  },
};

/** danger + disabled の組み合わせ */
export const DangerDisabled: Story = {
  args: {
    variant: "danger",
    disabled: true,
    children: "削除",
  },
};
