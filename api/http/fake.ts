import { Model, createServer } from "miragejs";
import { isWithinInterval, isBefore, isSameDay } from "date-fns";

interface Task {
  id: number;
  title: string;
  due: string;
  description: string;
  completed: boolean;
}

interface TasksWithinDateRanges {
  due: string;
  isOverdue: boolean;
  tasks: Task[];
}

const TASKS: Task[] = [
  {
    id: 1,
    due: "2024-05-20T03:00:00.000Z",
    title: "Work on Coderhub.dev design",
    description: "Design for Coderhub.dev",
    completed: false,
  },
  {
    id: 2,
    title: "Work",
    description: "Pipetech dadjfk jsdf",
    due: "2024-05-20T03:00:00.000Z",
    completed: true,
  },
  {
    id: 3,
    title: "Work on Coderhub.dev design",
    description: "Design for Coderhub.dev",
    due: "2024-05-22T03:00:00.000Z",
    completed: false,
  },
  {
    id: 4,
    title: "Work",
    description: "Pipetech dadjfk jsdf",
    due: "2024-05-22T03:00:00.000Z",
    completed: false,
  },
  {
    id: 5,
    title: "Get a hair cut",
    description: "Get a hair cut",
    due: "2024-05-23T22:54:08.988Z",
    completed: true,
  },
  {
    id: 6,
    title: "kdfldkfldsk",
    description: "kldfj",
    due: "2024-05-23T22:54:08.988Z",
    completed: false,
  },
];

export function fakeAPI() {
  return createServer({
    models: {
      tasks: Model,
    },

    seeds(server) {
      server.db.loadData({
        tasks: TASKS,
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/tasks", (_, request) => {
        let queryParams = request.queryParams;
        let from = queryParams.from;
        let to = queryParams.to;
        let onlyPendingTasks = queryParams.onlyPendingTasks;

        let tasks = this.schema.all("tasks").models as unknown as ({
          attrs: Task;
        } & Task)[];
        let tasksWithinDateRanges = tasks.reduce(
          (tasksWithinDateRange, task) => {
            const existentTaskWithinDateRangeIndex =
              tasksWithinDateRange.findIndex((taskWithinDateRange) => isSameDay(taskWithinDateRange.due, task.attrs.due));
            if (onlyPendingTasks && task.completed) {
              return tasksWithinDateRange;
            }
            let isOverdue = false;
            if (typeof from === "string" && typeof to === "string") {
              let isWithin = isWithinInterval(task.due, {
                start: new Date(from),
                end: new Date(to),
              });
              isOverdue = isBefore(new Date(task.due), new Date(from));
              if (!isWithin && !isOverdue && task.completed) {
                return tasksWithinDateRange;
              }
            }

            if (existentTaskWithinDateRangeIndex !== -1) {
              tasksWithinDateRange[existentTaskWithinDateRangeIndex].tasks.push(
                task.attrs
              );
            } else {
              tasksWithinDateRange.push({
                due: task.attrs.due,
                tasks: [task.attrs],
                isOverdue,
              });
            }
            return tasksWithinDateRange;
          },
          [] as TasksWithinDateRanges[]
        );

        console.log("tasksWithinDateRanges: ", tasksWithinDateRanges);

        return tasksWithinDateRanges;
      });

      this.patch("/tasks/complete/:id", (schema, request) => {
        const { id } = request.params;
        const task = schema.findBy("tasks", { id: Number(id) });
        task.update("completed", true);
        return task;
      });

      this.patch("/tasks/pending/:id", (schema, request) => {
        const { id } = request.params;
        const task = schema.findBy("tasks", { id: Number(id) });
        task.update("completed", false);
        return task;
      })
    },
  });
}
