import { getServerSession } from "next-auth";
import { Stack } from "@mui/material";

import { authOptions } from "src/lib/auth";
import Header from "src/widgets/Header";

const PageLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  const HEADER_HEIGHT = 64;
  return (
    <>
      <Stack height={HEADER_HEIGHT}>
        <Header user={session?.user} />
      </Stack>
      {children}
    </>
  );
};

export default PageLayout;
