import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  const statusConfig = {
    pending: {
      icon: "clock-outline",
      color: "#F59E0B",
      label: "Pending",
    },
    running: {
      icon: "progress-clock",
      color: "#3B82F6",
      label: "Running",
    },
    completed: {
      icon: "check-circle",
      color: "#22C55E",
      label: "Completed",
    },
    failed: {
      icon: "close-circle",
      color: "#EF4444",
      label: "Failed",
    },
  };

  const current = statusConfig[task.status];

  return (
    <View
      style={{
        backgroundColor: "#111827",
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#1F2937",
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 17,
            fontWeight: "700",
            flex: 1,
          }}
        >
          {task.title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name={current.icon as any}
            size={18}
            color={current.color}
          />

          <Text
            style={{
              color: current.color,
              marginLeft: 6,
              fontWeight: "600",
            }}
          >
            {current.label}
          </Text>
        </View>
      </View>

      {/* Description */}
      {task.description ? (
        <Text
          style={{
            color: "#94A3B8",
            marginTop: 10,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          {task.description}
        </Text>
      ) : null}

      {/* Footer */}
      <View
        style={{
          marginTop: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "#64748B",
            fontSize: 13,
          }}
        >
          Created
        </Text>

        <Text
          style={{
            color: "#CBD5E1",
            fontSize: 13,
          }}
        >
          {new Date(task.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}
