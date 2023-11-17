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
      render={({ input: { value, onChange }, meta }) => {
        const totalChecked = value?.length || 0;

        function onTriger(v: String) {
          if (!Boolean(value?.length)) {
            onChange([v]);
            return;
          }
          if (value?.includes(v)) {
            onChange(value?.filter((i: String) => i !== v));
            return;
          }
          onChange([...value, v]);
        }

        function onCheckedAll() {
          onChange(options.map((d) => d.value));
        }

        function onClearAll() {
          onChange(undefined);
        }

        const checkbox = options.map((box) => (
          <Stack
            key={box.value}
            onClick={() => onTriger(box.value)}
            flex={1}
            sx={(theme) => ({
              position: "relative",
              cursor: "pointer",
              maxWidth: `calc(${100 / item}% - ${theme.spacing(spacing)})`,
              flexBasis: `calc(${100 / item}% - ${theme.spacing(spacing)})`,
            })}
          >
            {renderCheckbox({
              value: box.value,
              label: box.label,
              checked: value?.includes(box.value),
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
