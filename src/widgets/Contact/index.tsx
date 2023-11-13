import { FC } from "react";
import { Paper } from "@mui/material";

import ContactForm from "src/forms/ContactForm";

import { ContactFormContainerProps } from "./Types";

const ContactFormContainer: FC<ContactFormContainerProps> = () => {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 } }}>
      <ContactForm />
    </Paper>
  );
};

export default ContactFormContainer;
