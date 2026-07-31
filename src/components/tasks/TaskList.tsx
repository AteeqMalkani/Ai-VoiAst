import React from "react";
import { View } from "react-native";

import { Task } from "@/types/task";
import { EmptyTasks } from "./EmptyTasks";
import { TaskCard } from "./TaskCard";

type TaskListProps = {
  tasks: Task[];
};

export function TaskList({ tasks }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return <EmptyTasks />;
  }

  return (
    <View style={{ width: "100%" }}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </View>
  );
}
