import { RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "./components/common/error-boundary/ErrorBoundary";
import { ToastContainer } from "./components/common/toast-container/ToastContainer";
import { router } from "./routes/routes";

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
