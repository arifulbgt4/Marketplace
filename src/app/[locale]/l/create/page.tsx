import { Box, Container } from "@mui/material";

import ListingForm from "src/forms/ListingForm";

const ListingCreatePage = () => {
  return (
    <Box pt={5}>
      <Container maxWidth="md">
        <ListingForm />
      </Container>
    </Box>
  );
};

export default ListingCreatePage;
