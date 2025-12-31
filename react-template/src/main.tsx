import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router"; // RR7 Import
import { store } from "@/store/store";
import { router } from "@/routes";
// import App from '@/App';

import "@/index.css";
import "./i18n";

async function enableMocking() {
  if (import.meta.env.MODE !== "development") {
    console.log(
      `Mocking disabled in production mode： import.meta.env.NODE_ENV = ${import.meta.env.MODE}`,
    );
    return;
  }

  // Dynamic import so it's not bundled in production
  const { worker } = await import("@/mocks/browser");

  // Start the worker
  return worker.start({
    onUnhandledRequest: "bypass", // Don't warn about assets/images
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>,
  );
});
