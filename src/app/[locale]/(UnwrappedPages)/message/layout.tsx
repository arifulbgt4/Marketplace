import { Stack } from "@mui/material";

import Header from "src/widgets/Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const HEADER_HEIGHT = 64;
  return (
    <>
      <Stack height={HEADER_HEIGHT}>
        <Header />
      </Stack>
      {children}
    </>
  );
};

export default PageLayout;
