import { RouterProvider } from "react-router-dom";

import { router } from "./routes/routes";
import { ErrorBoundary } from "./components/common/error-boundary/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
