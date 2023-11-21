import { FC, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Hidden,
  Box,
  Collapse,
} from "@mui/material";

import { OwnerAboutProps } from "./Types";

const OwnerAbout: FC<OwnerAboutProps> = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Stack gap={{ xs: 2, md: 4 }}>
      <Stack gap={2} width="100%">
        <Typography variant="h5">About</Typography>
        <Divider></Divider>
      </Stack>
      <Hidden mdUp>
        <Box
          onClick={() => {
            setChecked((prev) => !prev);
          }}
        >
          <Collapse in={checked} collapsedSize={78}>
            <Typography color="text,secondary">
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit
              esse quam nihil molestiae Sed ut perspiciatis unde omnis iste
              natus error sit voluptatem Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id es
              Quis autem vel eum iure reprehenderit Nemo enim ipsam voluptatem
              quia voluptas sit aspernatur aut odit aut Ut enim ad minima
              veniam, quis nostrum exercitationem ullam
            </Typography>
          </Collapse>
        </Box>
      </Hidden>
      <Hidden mdDown>
        <Typography color="text,secondary">
          Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
          quam nihil molestiae Sed ut perspiciatis unde omnis iste natus error
          sit voluptatem Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id es Quis autem vel eum iure
          reprehenderit Nemo enim ipsam voluptatem quia voluptas sit aspernatur
          aut odit aut Ut enim ad minima veniam, quis nostrum exercitationem
          ullam
        </Typography>
      </Hidden>
    </Stack>
  );
};

export default OwnerAbout;
