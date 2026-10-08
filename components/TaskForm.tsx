"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

interface TaskFormProps {
  onTaskCreated?: (title: string) => Promise<void>;
}

/**
 * タスク作成フォームコンポーネント
 * フォームのバリデーションと送信処理をテストする対象
 */
export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // クライアントサイドバリデーション
    if (!title.trim()) {
      setError("タスクのタイトルを入力してください");
      return;
    }

    if (title.length > 100) {
      setError("タスクのタイトルは100文字以内である必要があります");
      return;
    }

    setLoading(true);
    try {
      await onTaskCreated?.(title.trim());
      setTitle("");
    } catch (err) {
      setError("タスクの作成に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-2">
          新しいタスク
        </label>
        <div className="flex space-x-2">
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タスクを入力..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            aria-describedby={error ? "task-error" : undefined}
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "追加中..." : "追加"}
          </Button>
        </div>
        {error && (
          <p id="task-error" className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
