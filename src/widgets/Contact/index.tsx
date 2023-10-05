import { FC } from "react";
import { Paper } from "@mui/material";

import ContactForm from "src/forms/ContactForm";

import { ContactFProps } from "./Types";

const ContactF: FC<ContactFProps> = () => {
  return (
    <Paper>
      <ContactForm />
    </Paper>
  );
};

export default ContactF;
