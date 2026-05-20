import QueryProvider from "./app/QueryProvider";
import Router from "./app/router";

export default function App() {
  return (
    <QueryProvider>
      <Router />
    </QueryProvider>
  );
}