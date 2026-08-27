"use client";

import { useEffect } from "react";
import { notifyError } from "@/lib/notify";

interface ApiErrorToastProps {
  message: string;
}

export default function ApiErrorToast({ message }: ApiErrorToastProps) {
  useEffect(() => {
    notifyError(message);
  }, [message]);

  return null;
}
