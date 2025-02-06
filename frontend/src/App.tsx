import { RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "./components/common/error-boundary/ErrorBoundary";
import { router } from "./routes/routes";

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
