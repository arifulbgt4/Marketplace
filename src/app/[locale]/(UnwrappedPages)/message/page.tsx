"use client";
import { Container, Grid, Stack } from "@mui/material";

import MyMessage from "src/widgets/MyMessage";

const MessagePage = () => {
  return (
    <Stack height="calc(100vh - 64px)">
      <Container sx={{ px: { xs: 0, md: 2 } }}>
        <MyMessage />
      </Container>
    </Stack>
  );
};

export default MessagePage;
