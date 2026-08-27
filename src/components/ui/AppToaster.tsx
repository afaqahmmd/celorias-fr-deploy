"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      containerStyle={{ top: 16, right: 16 }}
      toastOptions={{
        duration: 4000,
        className: "font-sans text-sm",
        style: {
          background: "#ffffff",
          color: "#1a1a1a",
          border: "1px solid #eee",
          borderRadius: "4px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#1a3a32",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#7d444f",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
