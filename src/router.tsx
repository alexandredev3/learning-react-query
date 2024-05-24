import { BrowserRouter } from "react-router-dom";

import { TasksRoutes } from "./pages/tasks";

export function Router() {
  return (
    <BrowserRouter>
      <TasksRoutes />
    </BrowserRouter>
  )
}