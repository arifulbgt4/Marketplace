import { FC, forwardRef } from "react";
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from "@mui/material";

export interface TextFieldProps extends Omit<MuiTextFieldProps, "variant"> {
  error?: boolean;
  helperText?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ error, helperText, ...rest }, ref) => {
    return (
      <MuiTextField
        inputRef={ref}
        variant="outlined"
        error={error}
        helperText={helperText}
        {...rest}
      />
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
