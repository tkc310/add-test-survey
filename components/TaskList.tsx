"use client";

import { Button } from "@/components/Button";
import { Task } from "@/lib/types";
import { toggleTask, deleteTask } from "@/lib/actions";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
}

/**
 * タスクリストコンポーネント
 * 統合テストの対象となるコンポーネント
 */
export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const handleToggle = async (id: string) => {
    try {
      await toggleTask(id);
      onTaskUpdate();
    } catch (error) {
      console.error("タスクの更新に失敗しました:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      onTaskUpdate();
    } catch (error) {
      console.error("タスクの削除に失敗しました:", error);
    }
  };

  if (tasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">タスクがありません</div>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task.id)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              aria-label={`${task.title}を完了としてマーク`}
            />
            <span className={`${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
              {task.title}
            </span>
          </div>
          <Button
            variant="danger"
            onClick={() => handleDelete(task.id)}
            aria-label={`${task.title}を削除`}
          >
            削除
          </Button>
        </li>
      ))}
    </ul>
  );
}
