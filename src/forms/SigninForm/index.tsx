"use client";
// React
import { FC, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// @mui
import { Button, Stack, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// packages
import { Form as FinalForm } from "react-final-form";
import { FormApi } from "final-form";

// components
import { TextField, required, composeValidators } from "src/components/Input";
import { UserSigninOptions } from "src/global/types";
import { signIn } from "./actions";

import { SiginFormProps } from "./Types";

const INITIAL_VALUES: Omit<UserSigninOptions, "callbackUrl"> = {
  email: "",
  password: "",
};

const SigninForm: FC<SiginFormProps> = () => {
  const [isShow, setIsShow] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmitForm = async (
    values: Omit<UserSigninOptions, "callbackUrl">,
    form: FormApi<UserSigninOptions, Omit<UserSigninOptions, "callbackUrl">>
  ) => {
    try {
      const res = (await signIn({ ...values, callbackUrl })) as unknown as any;
      if (!!res.error) return;

      router.push(callbackUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handlevisibility = () => setIsShow((show) => !show);

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
                  id="email"
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
                  id="password"
                  name="password"
                  label="Password"
                  required
                  size="small"
                  fullWidth
                  type={isShow ? "text" : "password"}
                  fieldProps={{
                    validate: composeValidators(required("Password required")),
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handlevisibility}>
                        {isShow ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Stack>
              <Button
                type="submit"
                variant="contained"
                color="info"
                disabled={submitting}
                size="large"
              >
                sign in
              </Button>
            </Stack>
          </form>
        );
      }}
    />
  );
};

export * from "./Types";
export default SigninForm;
