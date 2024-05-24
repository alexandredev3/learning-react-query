import { useRoutes } from "react-router-dom";

import { DailyTasks } from "./daily-tasks";
import { MyTasks } from "./my-tasks";
import { TasksLayout } from "../layouts/tasks-layout";

export function TasksRoutes() {
  const tasksRoutes = useRoutes([
    {
      path: "/",
      element: <TasksLayout />,
      children: [
        {
          path: "/",
          element: <DailyTasks />,
        },
        {
          path: "/tasks",
          element: <MyTasks />,
        }
      ]
    }
  ]);
  return tasksRoutes;
}