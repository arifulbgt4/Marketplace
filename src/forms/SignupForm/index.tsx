"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Button, Stack, Alert, TextField, Checkbox } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userRegisterSchema, UserRegisterInput } from "src/lib/validations";

import { SignupFormProps } from "./Types";
import { signUp } from "./actions";

const SignupForm: FC<SignupFormProps> = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterInput>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmitForm = async (data: UserRegisterInput) => {
    try {
      setError(null);
      const res = (await signUp(data)) as any;
      if (!res?.ok) {
        const body = await res.json();
        setError(body?.message || "Registration failed");
        return;
      }
      router.push("/");
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Stack gap={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack gap={2}>
          <TextField
            label="Full name"
            required
            size="small"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name")}
          />
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
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password")}
          />
        </Stack>
        <Stack flexDirection="row" alignItems="center">
          <Checkbox size="small" defaultChecked />
          <Typography color="text.secondary">
            By signing up, you agree our Terms Privacy Policy and Cookies
            Policy
          </Typography>
        </Stack>
        <Button
          type="submit"
          variant="contained"
          color="info"
          disabled={isSubmitting}
        >
          Sign up
        </Button>
      </Stack>
    </form>
  );
};

export default SignupForm;
