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
import { useTranslations } from "next-intl";

const SigninForm: FC<SiginFormProps> = () => {
  const t = useTranslations("Auth");
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
        setError(t("invalidCredentials"));
        return;
      }
      router.push(callbackUrl);
    } catch {
      setError(t("unexpectedError"));
    }
  };

  const handleVisibility = () => setIsShow((show) => !show);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Stack gap={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        {verified && <Alert severity="success">{t("emailVerified")}</Alert>}
        {invalidVerification && (
          <Alert severity="error">{t("invalidVerification")}</Alert>
        )}
        <Stack gap={2}>
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
            type={isShow ? "text" : "password"}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleVisibility}
                  type="button"
                  aria-label={isShow ? t("hidePassword") : t("showPassword")}
                >
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
          {t("signIn")}
        </Button>
      </Stack>
    </form>
  );
};

export default SigninForm;
