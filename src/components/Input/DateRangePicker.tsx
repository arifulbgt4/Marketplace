// React
import { FC, useState } from "react";
// @mui
import { Box, Popover } from "@mui/material";
// packages
import { Field } from "react-final-form";
import { DateRange } from "react-date-range";
import "react-date-range/dist/theme/default.css";

// Util
import { formatDate } from "./util";
// Types
import { DateRangePickerProps, DateRangePickerWrapperProps } from "./Types";

const DateRangePicker: FC<DateRangePickerProps> = ({ name, renderPreview }) => {
  return (
    <Field
      name={name}
      render={({ input, meta }) => {
        return (
          <DateRangePickerWrapper
            renderPreview={renderPreview}
            input={input}
            meta={meta}
          />
        );
      }}
    />
  );
};

// ||-----------------------------------||
// ||   Date Range Picker Wrapper       ||
// ||   *** Don't export the component  ||
// ||-----------------------------------||
const DateRangePickerWrapper: FC<DateRangePickerWrapperProps> = ({
  renderPreview,
  input: { onChange, value, name },
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `popover_${name}` : undefined;

  return (
    <>
      <Box onClick={handleClick} sx={{ cursor: "pointer" }}>
        {renderPreview(
          formatDate(value?.startDate),
          formatDate(value?.endDate)
        )}
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <DateRange
          onChange={(item) => onChange(item.selection)}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={[
            {
              startDate: new Date(),
              endDate: new Date(),
              ...value,
              key: "selection",
            },
          ]}
          direction="horizontal"
          onRangeFocusChange={(v: number[]) => {
            if (!Boolean(v[1])) {
              handleClose();
            }
          }}
        />
      </Popover>
    </>
  );
};

export default DateRangePicker;
