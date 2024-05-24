import { Link, Outlet, useLocation } from "react-router-dom";
import { Calendar, NotebookText } from "lucide-react";

import {
  Tooltip,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export function TasksLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed left-4 top-4 rounded-xl z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <Tooltip.Provider>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <Tooltip.Trigger asChild>
                <Link
                  to="/"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    {
                      "bg-accent text-primary": pathname === "/",
                    }
                  )}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="sr-only">Daily Tasks</span>
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Content side="right">Daily Tasks</Tooltip.Content>
            </Tooltip>
            <Tooltip>
              <Tooltip.Trigger asChild>
                <Link
                  to="/tasks"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                    {
                      "bg-accent text-primary": pathname === "/tasks",
                    }
                  )}
                >
                  <NotebookText className="h-5 w-5" />
                  <span className="sr-only">My Tasks</span>
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Content side="right">My Tasks</Tooltip.Content>
            </Tooltip>
          </nav>
        </Tooltip.Provider>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid max-w-[600px] w-full mx-auto flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
