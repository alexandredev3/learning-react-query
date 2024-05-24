interface TaskDatesSeparatorProps {
  date: string;
}

export function TaskDatesSeparator({ date, children }: React.PropsWithChildren<TaskDatesSeparatorProps>) {
  return (
    <>
      <div className="border-b py-2">
        <strong>{date}</strong>
      </div>
      {children}
    </>
  );
}
