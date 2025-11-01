import { useEffect } from "react";
import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { ToastProvider, useToast } from "@/components/ui/toast";

function ToastListener({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      toast(event.detail);
    };

    window.addEventListener("show-toast" as any, handleShowToast);
    return () => {
      window.removeEventListener("show-toast" as any, handleShowToast);
    };
  }, [toast]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ToastListener>{children}</ToastListener>
      </ToastProvider>
    </QueryClientProvider>
  );
}
