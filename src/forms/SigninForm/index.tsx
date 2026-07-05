"use client";
import { FC, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Stack, IconButton, Alert, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSigninSchema, UserSigninInput } from "src/lib/validations";
import { signIn } from "./actions";

import { SiginFormProps } from "./Types";

const SigninForm: FC<SiginFormProps> = () => {
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const verified = searchParams.get("verified") === "1";
  const invalidVerification = searchParams.get("verification") === "invalid";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserSigninInput>({
    resolver: zodResolver(userSigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitForm = async (data: UserSigninInput) => {
    try {
      setError(null);
      const res = (await signIn({ ...data, callbackUrl })) as unknown as any;
      if (res?.error) {
        setError("Invalid email or password");
        return;
      }
      router.push(callbackUrl);
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    }
  };

  const handleVisibility = () => setIsShow((show) => !show);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Stack gap={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        {verified && (
          <Alert severity="success">Email verified. You can now sign in.</Alert>
        )}
        {invalidVerification && (
          <Alert severity="error">
            The verification link is invalid, expired, or already used.
          </Alert>
        )}
        <Stack gap={2}>
          <TextField
            label="Email"
            required
            size="small"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Password"
            required
            size="small"
            fullWidth
            type={isShow ? "text" : "password"}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleVisibility} type="button">
                  {isShow ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
            {...register("password")}
          />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          color="info"
          disabled={isSubmitting}
          size="large"
        >
          sign in
        </Button>
      </Stack>
    </form>
  );
};

export default SigninForm;
