"use client";

import toast from "react-hot-toast";

type ApiResult =
  | { success: true; message?: string }
  | { success: false; message: string };

export function notifySuccess(message: string) {
  toast.success(message, { id: `success:${message}` });
}

export function notifyError(message: string) {
  toast.error(message, { id: `error:${message}` });
}

export function notifyFromResult(
  result: ApiResult,
  options?: { successMessage?: string },
): boolean {
  if (result.success) {
    const message = result.message ?? options?.successMessage;
    if (message) {
      notifySuccess(message);
    }
    return true;
  }

  notifyError(result.message);
  return false;
}

export function notifyCaughtError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    notifyError(error.message);
    return;
  }

  notifyError(fallback);
}
