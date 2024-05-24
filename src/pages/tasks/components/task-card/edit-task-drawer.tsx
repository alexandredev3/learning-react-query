import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { TaskForm } from "../task-form";

interface EditTaskDrawerProps {
  isOpen: boolean;
  onOpenChange: (state: boolean) => void;
  onSubmit: () => void;
}

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export function EditTaskDrawer({ isOpen, onOpenChange }: EditTaskDrawerProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <TaskForm
      title="Edit Task"
      description="Edit your task."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      {...form}
    />
  );
}
