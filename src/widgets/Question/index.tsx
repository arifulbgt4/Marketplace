import { FC } from "react";
import { Typography } from "@mui/material";

import { QuestionProps } from "./Types";
import Info from "src/components/Info";

const Question: FC<QuestionProps> = () => {
  return (
    <Info title="Do you have any questions?">
      <Typography variant="h6">
        If you need help please contact us through support. Just leave a ticket
        and we will try to answer your question as soon as possible.
      </Typography>
    </Info>
  );
};

export default Question;
