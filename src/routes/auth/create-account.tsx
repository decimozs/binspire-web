import requestAccessApi from "@/api/request-access-api";
import verificationApi from "@/api/verification-api";
import CreateAccountForm from "@/components/form/create-account-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod/v4";

const protectedRouteSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const Route = createFileRoute("/auth/create-account")({
  component: CreateAccountRouteComponent,
  validateSearch: protectedRouteSchema,
  beforeLoad: async ({ search }) => {
    try {
      if (!search.token || !isNaN(Number(search.token)))
        throw new Error("Invalid token");

      const parsed = protectedRouteSchema.safeParse(search);

      if (!parsed.success) throw new Error("Invalid token");

      const token = parsed.data.token;

      const verificationResponse =
        await verificationApi.getVerificationByToken(token);

      const email = verificationResponse?.email;

      if (!email) throw new Error("Email not found in verification");

      const requestAccess =
        await requestAccessApi.getRequestAccessByEmail(email);

      if (!requestAccess) throw new Error("Request access not found");

      return { requestAccess };
    } catch {
      throw redirect({ to: "/" });
    }
  },
});

function CreateAccountRouteComponent() {
  return (
    <main className="h-screen flex items-center justify-center">
      <CreateAccountForm />
    </main>
  );
}
