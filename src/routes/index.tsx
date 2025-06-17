import LoginForm from "@/components/form/login-form";
import { createFileRoute } from "@tanstack/react-router";
import { successSonner } from "@/components/ui/sonner";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  loader: async () => {
    const res = await fetch("https://binspire-api.onrender.com/checkhealth");
    const data = await res.json();
    console.log("checkhealth: ", data);
    return { health: data };
  },
  component: Index,
});

function Index() {
  const { health } = Route.useLoaderData();
  const hasToasted = useRef(false);

  useEffect(() => {
    if (health?.success && !hasToasted.current) {
      successSonner("Connected to backend services");
      hasToasted.current = true;
    }
  }, [health]);

  return (
    <main className="h-screen flex items-center justify-center">
      <LoginForm />
    </main>
  );
}
