import { signIn as nextSignIn } from "next-auth/react";

import { UserSigninOptions } from "src/global/types";

export async function signIn({
  password,
  email,
  callbackUrl,
}: UserSigninOptions) {
  try {
    const res = await nextSignIn("credentials", {
      redirect: false,
      email: email,
      password: password,
      callbackUrl,
    });
    return res;
  } catch (error) {
    return error;
  }
}
