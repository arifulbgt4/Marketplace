import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { Calendar } from "react-date-range";
import format from "date-fns/format";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { TextField } from "src/components/Input";

const CalendarComp = () => {
  // date state
  const [calendar, setCalendar] = useState("");

  // open close
  const [open, setOpen] = useState(false);

  // get the target element to toggle
  const refOne: any = useRef(null);

  useEffect(() => {
    // set current date on component load
    setCalendar(format(new Date(), "MM/dd/yyyy"));
    // event listeners
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  // hide dropdown on ESC press
  const hideOnEscape = (e: any) => {
    // console.log(e.key)
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Hide on outside click
  const hideOnClickOutside = (e: any) => {
    // console.log(refOne.current)
    // console.log(e.target)
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  // on date change, store date in state
  const handleSelect = (date: any) => {
    // console.log(date)
    // console.log(format(date, 'MM/dd/yyyy'))
    setCalendar(format(date, "MM/dd/yyyy"));
  };

  return (
    <Box>
      <TextField
        fullWidth
        name="calender"
        value={calendar}
        label="avilabiliy date"
        onClick={() => setOpen((open) => !open)}
      />

      <Box ref={refOne}>
        {open && <Calendar date={new Date()} onChange={handleSelect} />}
      </Box>
    </Box>
  );
};
export default CalendarComp;
