import { redirect } from "next/navigation";

export default function FloristLoginPage() {
  redirect("/auth/sign-in");
}
