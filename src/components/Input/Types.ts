import { ReactNode } from "react";
// @mui
import {
  TextFieldProps as MuiTextFieldProps,
  SliderProps as MuiSliderProps,
  SwitchProps as MuiSwitchProps,
  SelectProps as MuiSelectProps,
  RadioGroupProps as MuiRadioGroupProps,
  CheckboxProps as MuiCheckboxProps,
  SxProps as MuiSxProps,
} from "@mui/material";
// packages
import { FieldProps, FieldRenderProps, FieldMetaState } from "react-final-form";

export interface TextFieldProps
  extends Partial<Omit<MuiTextFieldProps, "onChange">> {
  name: string;
  fieldProps?: Partial<FieldProps<any, any>>;
}

export interface TextFieldWrapperProps
  extends FieldRenderProps<MuiTextFieldProps> {}

export interface DateRangePickerProps {
  name: string;
  renderPreview: (startDate: string, endDate: string) => ReactNode;
  fieldProps?: Partial<FieldProps<any, any>>;
}

export interface DateRangePickerWrapperProps extends FieldRenderProps<any> {
  renderPreview: (startDate: string, endDate: string) => ReactNode;
}

export interface UploadImageProps {
  name: string;
  children: ReactNode;
  previewRender: (
    value: [],
    onRemoveImage: (index: number) => void
  ) => ReactNode;
  multiple?: boolean;
  sx?: MuiSxProps;
  fieldProps?: Partial<FieldProps<any, any>>;
}

export interface UploadImageWrapperProps extends FieldRenderProps<any> {
  sx?: MuiSxProps;
}

export interface SliderProps extends Partial<Omit<MuiSliderProps, "onChange">> {
  name: string;
  fieldProps?: Partial<FieldProps<any, any>>;
}

export interface SlideWrapperProps extends FieldRenderProps<MuiSliderProps> {}

export interface SwitchProps extends Partial<Omit<MuiSwitchProps, "onChange">> {
  name: string;
  fieldProps?: Partial<FieldProps<any, any>>;
}

export interface SwitchWrapperProps extends FieldRenderProps<MuiSwitchProps> {}

export interface SelectProps extends Partial<Omit<MuiSelectProps, "onChange">> {
  name: string;
  fieldProps?: Partial<FieldProps<any, any>>;
}

export interface SelectWrapperProps extends FieldRenderProps<MuiSelectProps> {}

export interface RadioGroupProps
  extends Partial<Omit<MuiRadioGroupProps, "onChange">> {
  name: string;
  fieldProps?: Partial<FieldProps<any, any>>;
}

export interface RadioGroupWrapperProps
  extends FieldRenderProps<MuiRadioGroupProps> {}

export interface CheckboxProps
  extends Partial<Omit<MuiCheckboxProps, "onChange">> {
  name: string;
  fieldProps?: Partial<FieldProps<any, any>>;
}

export interface CheckboxWrapperProps
  extends FieldRenderProps<MuiCheckboxProps> {}

export interface CheckboxOptions {
  value: string;
  label: string;
}
export interface RenderLabelOptions {
  checked: number;
  unchecked: number;
  total: number;
  onCheckedAll: () => void;
  onClearAll: () => void;
}

export interface RenderCheckboxOptions {
  value: String;
  label: String;
  checked: Boolean;
}

export interface CheckboxGroupProps
  extends Partial<Omit<MuiCheckboxProps, "onChange">> {
  name: string;
  rootSx?: MuiSxProps;
  renderLabel: (props: RenderLabelOptions) => ReactNode;
  renderCheckbox: (props: RenderCheckboxOptions) => ReactNode;
  options: CheckboxOptions[];
  fieldProps?: Partial<FieldProps<any, any>>;
  spacing?: number;
  item?: number;
}

export type FieldShowErrorOptions = (props: FieldMetaOptions) => boolean;

export interface FieldMetaOptions {
  meta: FieldMetaState<any>;
}

export type FormatDateOptions = (date: Date | undefined) => string;
