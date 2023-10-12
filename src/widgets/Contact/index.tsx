import { FC } from "react";
import { Paper } from "@mui/material";

import ContactForm from "src/forms/ContactForm";

import { ContactFormContainerProps } from "./Types";

const ContactFormContainer: FC<ContactFormContainerProps> = () => {
  return (
    <Paper>
      <ContactForm />
    </Paper>
  );
};

export default ContactFormContainer;
