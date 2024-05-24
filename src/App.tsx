import { QueryClientProvider } from "@tanstack/react-query";

import { Router } from "@/router"
import { fakeAPI } from "../api/http/fake";
import { queryClient } from "./services/react-query";

fakeAPI();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  )
}
