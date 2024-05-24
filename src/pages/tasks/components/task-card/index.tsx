import React, { useState } from "react";
import {
  CalendarClock,
  GripVertical,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";

import { Card, RadioGroup, DropdownMenu } from "@/components/ui";
import { DeleteTaskAlertDialog } from "./delete-task-alert-dialog";
import { EditTaskDrawer } from "./edit-task-drawer";
import { cn } from "@/lib/utils";
import {
  TaskList,
  markTaskAsCompleted,
  markTaskAsPending,
} from "@/services/http/tasks";
import { queryClient } from "@/services/react-query";

interface TaskCardProps {
  id: number;
  title: string;
  due: string;
  completed: boolean;
  isOverdue: boolean;
}

export function TaskCard({
  id,
  title,
  due,
  completed,
  isOverdue,
}: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  let markTaskAsCompletedMutation = useMutation({
    mutationFn: () => markTaskAsCompleted(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["daily-tasks"] });
      const previousTasks = queryClient.getQueryData(["daily-tasks"]);
      queryClient.setQueryData(
        ["daily-tasks"],
        (oldData: TaskList[]) => {
          const newTasks = produce(oldData.filter(Boolean), (draft) => {
            if (!oldData) return undefined;
            const tasksWithinDateRangeIndex = draft.findIndex(
              (taskWithinDateRange) => isSameDay(taskWithinDateRange.due, due)
            );

            if (tasksWithinDateRangeIndex === -1) return undefined;

            const tasksWithinDateRange = draft[tasksWithinDateRangeIndex];
            const hasOneTask = tasksWithinDateRange.tasks.filter(Boolean).length === 1;
            if (hasOneTask) {
              delete draft[tasksWithinDateRangeIndex];
              return draft;
            }

            const taskIndex = tasksWithinDateRange.tasks.findIndex(
              (task) => task.id === id
            );
            if (taskIndex === -1) return undefined;

            delete tasksWithinDateRange.tasks[taskIndex];

            return draft;
          });
          return newTasks;
        }
      );

      return { previousTasks };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(
        ["daily-tasks"],
        context?.previousTasks
      );
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["daily-tasks"],
      // });
    },
  });
  let markTaskAsPendingMutation = useMutation({
    mutationFn: () => markTaskAsPending(id),
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["daily-tasks"],
      // });
    },
  });

  async function handleToggleCompleted() {
    if (completed) {
      setIsCompleted(false);
      markTaskAsPendingMutation.mutate();
    } else {
      setIsCompleted(true);
      markTaskAsCompletedMutation.mutate();
    }
  }

  const isMutating =
    markTaskAsCompletedMutation.isPending ||
    markTaskAsPendingMutation.isPending;

  return (
    <Card
      x-chunk="dashboard-01-chunk-0"
      className={cn("w-full shadow-lg shadow-primary/5", {
        "opacity-65": completed || isMutating,
      })}
    >
      <Card.Header className="flex flex-row justify-between items-center space-y-0 gap-2 pb-2">
        <div className="flex flex-row items-center space-y-0 gap-2">
          <span className="cursor-grab">
            <GripVertical className="w-4 h-4 text-white/25" />
          </span>
          <RadioGroup.Item
            id={id.toString()}
            value={id.toString()}
            checked={isCompleted}
            onClick={handleToggleCompleted}
            disabled={isMutating}
          />
          <Card.Title
            className={cn("text-sm font-medium", {
              "line-through": completed,
            })}
          >
            {title}
          </Card.Title>
        </div>
        <TaskOptions />
      </Card.Header>
      <Card.Content>
        <div className="flex items-center gap-2 ml-4">
          <CalendarClock
            className={cn("w-4 h-4", {
              "text-red-500": isOverdue,
            })}
          />
          <p
            className={cn("text-xs text-muted-foreground", {
              "text-red-500": isOverdue,
            })}
          >
            {format(new Date(due), "MMM dd")}
          </p>
        </div>
      </Card.Content>
    </Card>
  );
}

function TaskOptions() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button className="transition-colors hover:bg-accent">
            <EllipsisVertical className="w-6 h-6 rounded-lg p-1" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-56">
          <DropdownMenu.Item
            className="flex flex-row gap-2"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="w-4 h-4" /> <span>Edit</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex flex-row gap-2 bg-red-600 hover:bg-red-500"
            onClick={() => setIsDeleting(true)}
          >
            <Trash2 className="w-4 h-4" /> <span>Delete</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DeleteTaskAlertDialog
        isOpen={isDeleting}
        onOpenChange={setIsDeleting}
        onDelete={() => setIsDeleting(false)}
      />
      <EditTaskDrawer
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        onSubmit={() => setIsEditing(false)}
      />
    </>
  );
}

export function TaskCardRoot({
  children,
  ...rest
}: React.PropsWithChildren<React.ComponentProps<typeof RadioGroup>>) {
  return <RadioGroup {...rest}>{children}</RadioGroup>;
}

export const Task = Object.assign(TaskCardRoot, {
  Card: TaskCard,
});
