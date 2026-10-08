"use client";

import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";
import { Task } from "@/lib/types";
import { useState, useCallback } from "react";
import { createTask as createTaskAction } from "@/lib/actions";

interface TaskManagerProps {
  initialTasks: Task[];
}

/**
 * タスク管理を統括するコンポーネント
 * TaskFormとTaskListの状態を共有する
 */
export function TaskManager({ initialTasks }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleTaskCreated = useCallback(async (title: string) => {
    const newTask = await createTaskAction({ title });
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const handleTaskUpdate = useCallback(async () => {
    // タスクが更新されたときは、サーバーから最新のタスクリストを取得
    const { getTasks } = await import("@/lib/actions");
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
  }, []);

  return (
    <>
      <div className="mb-8">
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">タスク一覧</h2>
        <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} />
      </div>
    </>
  );
}
