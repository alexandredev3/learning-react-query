import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui";
import { TaskForm } from "./task-form";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export function AddTask() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="mt-2">
      <TaskForm
        title="Add Task"
        description="Add your task."
        isOpen={isAdding}
        onOpenChange={setIsAdding}
        {...form}
      />
      <Button
        variant="ghost"
        className="flex gap-2"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="w-4 h-4 text-primary" /> Add Task
      </Button>
    </div>
  );
}
