import { UserRegisterOptions } from "src/global/types";

export async function signUp({ password, email, name }: UserRegisterOptions) {
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}
