import { RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "./components/common/error-boundary/ErrorBoundary";
import { Toast } from "./components/common/toast/Toast";
import { router } from "./routes/routes";

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toast />
    </ErrorBoundary>
  );
}

export default App;
