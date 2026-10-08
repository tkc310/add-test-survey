import type { Preview } from "@storybook/nextjs-vite";

// Tailwind などアプリ共通スタイルを Storybook でも適用する
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - テスト UI でのみ a11y 違反を表示
      // 'error' - a11y 違反で CI を失敗させる
      // 'off' - a11y チェックを無効化
      test: "todo",
    },
  },
};

export default preview;
