import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TaskList } from "@/components/tasks/TaskList";
import { useVoiceStore } from "@/store/voiceStore";

export default function TasksScreen() {
  const { tasks: storeTasks, lastTask } = useVoiceStore();

  // Prefer storeTasks array; fallback to lastTask if array is empty
  const tasks =
    storeTasks && storeTasks.length > 0
      ? storeTasks
      : lastTask
        ? [lastTask]
        : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Tasks</Text>
        <Text style={styles.subtitle}>
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"} logged
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        <TaskList tasks={tasks as any} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B14",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
});
