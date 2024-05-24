import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Task } from "../components/task-card";
import { Header } from "../components/header";
import { AddTask } from "../components/add-task";
import { getTasks } from "@/services/http/tasks";
import { TaskDatesSeparator } from "../components/tasks-dates-separator";
import { getTodayDate } from "../get-today-date";
import { Skeleton } from "@/components/ui";

const { from, to } = getTodayDate();

export function DailyTasks() {
  const { data, isLoading } = useQuery({
    queryKey: ["daily-tasks"],
    queryFn: async () => {
      return getTasks({
        from,
        to,
        overdue: true,
        onlyPendingTasks: true,
      });
    },
  });

  return (
    <div>
      <Header title="Daily Tasks">
        <div className="flex items-center gap-2 mt-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>
            <strong>{data?.flatMap((task) => task?.tasks).filter(Boolean).length}</strong> Pending task(s)
          </span>
        </div>
      </Header>
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4">
          <Skeleton className="h-[90px]" />
          <Skeleton className="h-[90px]" />
          <Skeleton className="h-[90px]" />
        </div>
      ) : (
      <Task className="mt-6 grid grid-cols-1 gap-4">
        {data?.map((tasksWithinDateRange) => tasksWithinDateRange?.due && (
          <div key={tasksWithinDateRange.due} className="flex flex-col gap-4">
            <TaskDatesSeparator
              date={
                tasksWithinDateRange.isOverdue
                  ? `Overdue, ${format(
                      new Date(tasksWithinDateRange.due),
                      "MMM dd"
                    )}`
                  : `Today, ${format(
                      new Date(tasksWithinDateRange.due),
                      "MMM dd"
                    )}`
              }
            />
            {tasksWithinDateRange.tasks.map((task) => task?.id && (
              <Task.Card
                key={task.id}
                id={task.id}
                title={task.title}
                due={tasksWithinDateRange.due}
                completed={task.completed}
                isOverdue={tasksWithinDateRange.isOverdue}
              />
            ))}
          </div>
        ))}
      </Task>
      )}
      <AddTask />
    </div>
  );
}
