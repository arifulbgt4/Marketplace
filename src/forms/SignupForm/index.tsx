"use client";
// React
import { FC } from "react";
import { useRouter } from "next/navigation";
// @mui
import { Typography, Button, Stack } from "@mui/material";

// packages
import { Form as FinalForm } from "react-final-form";
import { FormApi } from "final-form";

// components
import {
  TextField,
  required,
  composeValidators,
  Checkbox,
} from "src/components/Input";

// Types
import { UserRegisterOptions } from "src/global/types";

import { SignupFormProps } from "./Types";

// actions
import { signUp } from "./actions";

const INITIAL_VALUES: UserRegisterOptions = {
  name: "",
  email: "",
  password: "",
};

const SignupForm: FC<SignupFormProps> = () => {
  const router = useRouter();
  const onSubmitForm = async (
    values: UserRegisterOptions,
    form: FormApi<UserRegisterOptions, UserRegisterOptions>
  ) => {
    try {
      const res = (await signUp(values)) as unknown as any;
      if (!res?.ok) return;
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      initialValues={INITIAL_VALUES}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Stack gap={2.5}>
              <Stack gap={2}>
                <TextField
                  name="name"
                  label="Full name"
                  required
                  size="small"
                  fullWidth
                  fieldProps={{
                    validate: composeValidators(required("Full name required")),
                  }}
                />
                <TextField
                  name="username"
                  label="Use name"
                  required
                  size="small"
                  fullWidth
                  fieldProps={{
                    validate: composeValidators(required("User name required")),
                  }}
                />
                <TextField
                  name="email"
                  label="Email"
                  required
                  size="small"
                  type="email"
                  fullWidth
                  fieldProps={{
                    validate: composeValidators(required("Email required")),
                  }}
                />
                <TextField
                  name="password"
                  label="Password"
                  required
                  size="small"
                  fullWidth
                  type="password"
                  fieldProps={{
                    validate: composeValidators(required("Password required")),
                  }}
                />
              </Stack>
              <Stack flexDirection="row" alignItems="center" gap={2}>
                <Checkbox name="check" />
                <Typography color="text.secondary">
                  By signing up, you agree our Terms Privacy Policy and Coockies
                  Policy
                </Typography>
              </Stack>
              <Typography color="text.secondary">
                People who use our service may have uploaded your contact
                information to Dream House.
              </Typography>

              <Button
                type="submit"
                variant="contained"
                color="info"
                disabled={submitting}
              >
                Sign up
              </Button>
            </Stack>
          </form>
        );
      }}
    />
  );
};

export * from "./Types";
export default SignupForm;
