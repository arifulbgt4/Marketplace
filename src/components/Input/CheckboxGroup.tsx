// React
import React, { FC } from "react";
// packages
import { Box, Stack } from "@mui/material";
import { Field } from "react-final-form";

// Types
import { CheckboxGroupProps } from "./Types";

const CheckboxGroup: FC<CheckboxGroupProps> = ({
  name,
  options,
  renderCheckbox,
  renderLabel,
  rootSx,
  fieldProps,
  spacing = 1,
  item = 1,
  ...rest
}) => {
  const totalOptions = options?.length || 0;
  return (
    <Field
      name={name}
      render={({ input: { value: inputValue, onChange }, meta }) => {
        const totalChecked = inputValue?.length || 0;

        function onTriger(v: String) {
          if (!Boolean(inputValue?.length)) {
            onChange([v]);
            return;
          }
          if (inputValue?.includes(v)) {
            onChange(inputValue?.filter((i: String) => i !== v));
            return;
          }
          onChange([...inputValue, v]);
        }

        function onCheckedAll() {
          onChange(options.map((d) => d.value));
        }

        function onClearAll() {
          onChange(undefined);
        }

        const checkbox = options.map(({ label, value, ...restData }) => (
          <Stack
            key={value}
            onClick={() => onTriger(value)}
            flex={1}
            sx={(theme) => ({
              position: "relative",
              cursor: "pointer",
              maxWidth: `calc(${100 / item}% - ${theme.spacing(spacing)})`,
              flexBasis: `calc(${100 / item}% - ${theme.spacing(spacing)})`,
            })}
          >
            {renderCheckbox({
              value,
              label,
              checked: inputValue?.includes(value),
              ...restData,
            })}
          </Stack>
        ));

        return (
          <Box sx={rootSx}>
            {renderLabel({
              checked: totalChecked,
              unchecked: totalOptions - totalChecked,
              total: totalOptions,
              onCheckedAll,
              onClearAll,
            })}
            <Stack direction="row" flexWrap="wrap" gap={spacing} mr={-spacing}>
              {checkbox}
            </Stack>
          </Box>
        );
      }}
      {...fieldProps}
    />
  );
};

export default CheckboxGroup;
