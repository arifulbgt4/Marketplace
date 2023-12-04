"use client";
// React
import { FC, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// @mui
import {
  Typography,
  Button,
  Grid,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
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
import Logo from "src/components/Logo";
import { Facebook, FacebookRounded, Google } from "@mui/icons-material";
import routes from "src/global/routes";

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
    <Stack width={500} gap={2.5}>
      <Stack border={1} borderColor="divider" gap={2.5} sx={{ p: 5 }}>
        <Stack justifyContent="center" alignItems="center" pb={2.5}>
          <Logo />
        </Stack>
        <Divider />
        <Typography textAlign="center" variant="h3">
          Sign In
        </Typography>
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
                      label="Mobile Number, Username or Email"
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
                        validate: composeValidators(
                          required("Password required")
                        ),
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={handlevisibility}>
                            {isShow ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
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
                  <Grid
                    container
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={5.5}>
                      <Divider />
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      justifyContent="center"
                      alignItems="center"
                      display="flex"
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        or
                      </Typography>
                    </Grid>
                    <Grid item xs={5.5}>
                      <Divider />
                    </Grid>
                  </Grid>
                  <Stack
                    flexDirection="row"
                    gap={5}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <IconButton>
                      <Google fontSize="large" />
                    </IconButton>
                    <IconButton>
                      <FacebookRounded fontSize="large" color="primary" />
                    </IconButton>
                  </Stack>
                  <Button size="large">Forgot password?</Button>
                </Stack>
              </form>
            );
          }}
        />
      </Stack>
      <Stack
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        py={5}
        border={1}
        borderColor="divider"
      >
        <Typography variant="subtitle1">Have an account?</Typography>
        <Button href={routes.signup}>Sign up</Button>
      </Stack>
    </Stack>
  );
};

export * from "./Types";
export default SigninForm;
