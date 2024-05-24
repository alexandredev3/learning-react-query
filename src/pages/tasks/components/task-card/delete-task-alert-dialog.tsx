import { AlertDialog } from "@/components/ui";

interface DeleteTaskAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (state: boolean) => void;
  onDelete: () => void;
}

export function DeleteTaskAlertDialog({
  isOpen,
  onOpenChange,
  onDelete,
}: DeleteTaskAlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. This will permanently delete your
            task.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action
            className="bg-red-600 hover:bg-red-500 text-white"
            onClick={onDelete}
          >
            Continue
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}