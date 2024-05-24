import React from "react";
import { CalendarIcon } from "lucide-react";
import { format, isBefore, isEqual } from "date-fns";

import {
  Button,
  Drawer,
  Input,
  Form,
  Popover,
  Calendar,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const today = new Date();

interface TaskFormProps
  extends Omit<React.ComponentProps<typeof Form>, "children"> {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (state: boolean) => void;
}

export function TaskForm({ isOpen, onOpenChange, title, description, ...rest }: TaskFormProps) {
  return (
    <Form {...rest}>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Content>
          <div className="mx-auto w-full max-w-sm">
            <Drawer.Header className="px-0">
              <Drawer.Title>{title}</Drawer.Title>
              <Drawer.Description>{description}</Drawer.Description>
            </Drawer.Header>
            <Form.Field
              control={rest.control}
              name="dob"
              render={({ field }) => (
                <div className="grid items-start gap-4 w-full">
                  <Form.Item className="grid gap-2">
                    <Form.Label>Name</Form.Label>
                    <Input id="name" defaultValue="@shadcn" />
                  </Form.Item>
                  <Form.Item className="flex flex-col">
                    <Form.Label>Due</Form.Label>
                    <Popover>
                      <Popover.Trigger asChild>
                        <Form.Control>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </Form.Control>
                      </Popover.Trigger>
                      <Popover.Content className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            isBefore(date, today) &&
                            !isEqual(date.getDate(), today.getDate())
                          }
                          initialFocus
                        />
                      </Popover.Content>
                    </Popover>
                    <Form.Description>
                      Select a due date for your task.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                  <Drawer.Footer className="px-0">
                    <Button type="submit">Submit</Button>
                    <Drawer.Close asChild onClick={() => onOpenChange(false)}>
                      <Button variant="outline">Cancel</Button>
                    </Drawer.Close>
                  </Drawer.Footer>
                </div>
              )}
            />
          </div>
        </Drawer.Content>
      </Drawer>
    </Form>
  );
}
