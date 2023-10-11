// React
import { FC } from "react";
// @mui
import { Stack } from "@mui/material";
// packages
import { Field } from "react-final-form";

// Util
import { showErrorOnChange } from "./util";
// Types
import { UploadImageProps, UploadImageWrapperProps } from "./Types";

const UploadImage: FC<UploadImageProps> = ({
  name,
  children,
  previewRender,
  multiple = false,
  fieldProps,
  sx,
  ...rest
}) => {
  return (
    <Field
      name={name}
      render={({ input: { onChange, value, ...rest }, meta }) => {
        const handleChange = ({
          target,
        }: React.ChangeEvent<HTMLInputElement>) => {
          if (!target.files?.length) return;

          if (!Boolean(value)) {
            onChange([target.files]);
            return;
          }

          onChange([...value, target.files]);
        };

        const onRemoveImage = (index: number) => {
          if (!Boolean(value)) return;

          value.splice(index, 1);
          onChange([...value]);
        };

        const uploadElement = (
          <UploadImageWrapper
            input={rest}
            onChange={handleChange}
            meta={meta}
            sx={sx}
            {...rest}
          >
            {children}
          </UploadImageWrapper>
        );
        const imageUrls = () => {
          return Boolean(value)
            ? value.map((img: FileList | string) => {
                if (typeof img === "string") return img;
                return URL.createObjectURL(img[0]);
              })
            : [];
        };

        return (
          <>
            {Boolean(value) && previewRender(imageUrls(), onRemoveImage)}
            {multiple
              ? uploadElement
              : !Boolean(value?.length) && uploadElement}
          </>
        );
      }}
      {...fieldProps}
    />
  );
};

// ||-----------------------------------||
// ||   UploadImage Wrapper             ||
// ||   *** Don't export the component  ||
// ||-----------------------------------||
const UploadImageWrapper: FC<UploadImageWrapperProps> = ({
  input: { name, value, type, onBlur, onFocus, ...restInput },
  meta,
  onChange,
  helperText,
  required,
  children,
  sx,
  ...rest
}) => {
  const { error, submitError } = meta;
  const isError = showErrorOnChange({ meta });
  return (
    <Stack component="label" mb={2.5} sx={sx}>
      {children}
      <input
        style={{ display: "none" }}
        name={name}
        type="file"
        required={required}
        {...restInput}
        onChange={onChange}
      />
    </Stack>
  );
};
// ||----------------------------end

export default UploadImage;
