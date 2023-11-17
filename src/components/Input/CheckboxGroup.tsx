// React
import React, { FC } from "react";
// packages
import { Field } from "react-final-form";

// Types
import { CheckboxGroupProps } from "./Types";

const CheckboxGroup: FC<CheckboxGroupProps> = ({
  name,
  options,
  renderCheckbox,
  renderContainer,
  fieldProps,
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
          <React.Fragment key={box.value}>
            {renderCheckbox({
              value: box.value,
              label: box.label,
              checked: value?.includes(box.value),
              onClick: () => onTriger(box.value),
            })}
          </React.Fragment>
        ));

        return renderContainer({
          checkbox,
          checked: totalChecked,
          unchecked: totalOptions - totalChecked,
          total: totalOptions,
          onCheckedAll,
          onClearAll,
        });
      }}
      {...fieldProps}
    />
  );
};

export default CheckboxGroup;
