"use client";
import { Box, Container, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        gap={3}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
        <Typography variant="h3" textAlign="center">
          Something went wrong
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          {error.message || "An unexpected error occurred"}
        </Typography>
        <Button variant="contained" size="large" onClick={reset}>
          Try Again
        </Button>
      </Box>
    </Container>
  );
}
