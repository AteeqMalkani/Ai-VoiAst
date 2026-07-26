import { View } from "react-native";

import WorkflowStep from "./WorkflowStep";

const steps = [
  {
    icon: "brain",
    title: "Understand Intent",
  },
  {
    icon: "calendar-month",
    title: "Open Google Calendar",
  },
  {
    icon: "account-plus",
    title: "Invite Ali",
  },
  {
    icon: "alarm-check",
    title: "Add Reminder",
  },
  {
    icon: "check-circle",
    title: "Meeting Scheduled",
  },
];

type Props = {
  scene: number;
};

export default function Workflow({ scene }: Props) {
  return (
    <View
      style={{
        marginTop: 28,
      }}
    >
      {steps.map((step, index) => {
        if (scene < index + 2) return null;

        return (
          <WorkflowStep
            key={step.title}
            icon={step.icon}
            title={step.title}
            active={scene === index + 2}
            completed={scene > index + 2}
            last={index === steps.length - 1}
          />
        );
      })}
    </View>
  );
}
