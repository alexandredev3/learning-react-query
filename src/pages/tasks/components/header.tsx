import React from "react";

interface HeaderProps {
  title: string;
}

export function Header({
  title,
  children,
}: React.PropsWithChildren<HeaderProps>) {
  return (
    <header>
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
