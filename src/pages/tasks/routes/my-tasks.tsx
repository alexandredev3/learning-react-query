import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import { getTasks } from "@/services/http/tasks";
import { Header } from "../components/header";
import { TaskDatesSeparator } from "../components/tasks-dates-separator";
import { Skeleton } from "@/components/ui";
import { Task } from "../components/task-card";

export function MyTasks() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: async () => {
      return getTasks({
        overdue: true,
        onlyPendingTasks: true,
      });
    },
  });

  return (
    <div>
      <Header title="My Tasks" />
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4">
          <Skeleton className="h-[90px]" />
          <Skeleton className="h-[90px]" />
          <Skeleton className="h-[90px]" />
        </div>
      ) : (
        <Task className="mt-6 grid grid-cols-1 gap-4">
          {data?.map(
            (tasksWithinDateRange) =>
              tasksWithinDateRange?.due && (
                <div
                  key={tasksWithinDateRange.due}
                  className="flex flex-col gap-4"
                >
                  <TaskDatesSeparator
                    date={format(new Date(tasksWithinDateRange.due), "MMM dd")}
                  />
                  {tasksWithinDateRange.tasks.map(
                    (task) =>
                      task?.id && (
                        <Task.Card
                          key={task.id}
                          id={task.id}
                          title={task.title}
                          due={tasksWithinDateRange.due}
                          completed={task.completed}
                          isOverdue={tasksWithinDateRange.isOverdue}
                        />
                      )
                  )}
                </div>
              )
          )}
        </Task>
      )}
    </div>
  );
}
