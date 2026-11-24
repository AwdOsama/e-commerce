import type { Metadata } from "next";
import Register from "./Register";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {

  return <Register/>;
}
