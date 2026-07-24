"use client";
import { FC, useState } from "react";
import {
  Typography,
  Button,
  Stack,
  Alert,
  TextField,
  Checkbox,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userRegisterSchema, UserRegisterInput } from "src/lib/validations";

import { SignupFormProps } from "./Types";
import { signUp } from "./actions";
import { useTranslations } from "next-intl";

const SignupForm: FC<SignupFormProps> = () => {
  const t = useTranslations("Auth");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verificationPreviewUrl, setVerificationPreviewUrl] = useState("");

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
      const body = await res.json();
      setVerificationPreviewUrl(body.verificationPreviewUrl || "");
      setSuccess(
        body.emailDelivery === "unavailable"
          ? t("accountCreatedNoEmail")
          : t("accountCreated"),
      );
    } catch {
      setError(t("unexpectedError"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Stack gap={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        {verificationPreviewUrl && (
          <Button
            component="a"
            href={verificationPreviewUrl}
            variant="outlined"
          >
            Open development verification link
          </Button>
        )}
        <Stack gap={2}>
          <TextField
            label={t("fullName")}
            required
            size="small"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name")}
          />
          <TextField
            label={t("email")}
            required
            size="small"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label={t("password")}
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
          <Typography color="text.secondary">{t("terms")}</Typography>
        </Stack>
        <Button
          type="submit"
          variant="contained"
          color="info"
          disabled={isSubmitting}
        >
          {t("signUp")}
        </Button>
      </Stack>
    </form>
  );
};

export default SignupForm;
