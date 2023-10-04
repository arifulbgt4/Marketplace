import { FC } from "react";
import { FormControl, Paper } from "@mui/material";

import { ContactFormProps } from "./Types";

const ContactForm: FC<ContactFormProps> = () => {
  return (
    <Paper>
      <FormControl>ContactForm</FormControl>
    </Paper>
  );
};

export default ContactForm;
