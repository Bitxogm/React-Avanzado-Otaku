import LoginForm from "@/components/forms/LoginForm";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login",
  description: "Inicia sesión en tu cuenta",
};

export default function LoginPage() {

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <LoginForm from="" />
    </div>
  );
}
