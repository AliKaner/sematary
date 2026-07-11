import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import "./index.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;

if (!convexUrl) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <main className="flex h-screen flex-col items-center justify-center p-6 text-center text-bone">
      <div className="max-w-md rounded border border-bone/20 bg-moss/20 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-bone">VITE_CONVEX_URL Eksik</h1>
        <p className="mt-4 text-bone/80">
          Vercel üzerinde sitenizin çalışabilmesi için <strong>VITE_CONVEX_URL</strong> çevre değişkenini (Environment Variable) tanımlamanız gerekmektedir.
        </p>
        <p className="mt-2 text-sm text-bone/60">
          Vercel projenizin ayarlarına gidip `.env.local` dosyanızdaki `VITE_CONVEX_URL` değerini ekleyin ve ardından tekrar deploy edin.
        </p>
      </div>
    </main>,
  );
} else {
  const convex = new ConvexReactClient(convexUrl);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ConvexProvider client={convex}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexProvider>
    </React.StrictMode>,
  );
}
