import { UserRegisterOptions } from "src/global/types";

export async function signUp({ password, email, name }: UserRegisterOptions) {
  return fetch("/api/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
