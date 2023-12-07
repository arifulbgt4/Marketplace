import { FC, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { HeaderLanguageProps } from "./Types";
import { Stack, Typography } from "@mui/material";

const HeaderLanguage: FC<HeaderLanguageProps> = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box px={2} py={5}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab label="Language and region" value="1" />
            <Tab label="Currency" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Stack pb={4} gap={3}>
            <Typography variant="h5">
              Suggested languages and regions
            </Typography>
            <Stack flexDirection="row" gap={4}>
              <Stack flexDirection="row" gap={1.25}>
                <Typography variant="h4">FLG</Typography>
                <Box>
                  <Typography variant="h5">Vietnam</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vietnamese
                  </Typography>
                </Box>
              </Stack>
              <Stack flexDirection="row" gap={1.25}>
                <Typography variant="h4">FLG</Typography>
                <Box>
                  <Typography variant="h5">Vietnam</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vietnamese
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
          <Stack>
            <Typography variant="h5">Choose a language and region</Typography>
          </Stack>
        </TabPanel>
        <TabPanel value="2">
          <Stack pb={4} gap={3}>
            <Typography variant="h5">
              Suggested languages and regions
            </Typography>
            <Stack flexDirection="row" gap={4}>
              <Stack flexDirection="row" gap={1.25}>
                <Typography variant="h4">FLG</Typography>
                <Box>
                  <Typography variant="h5">Vietnam</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Dong (VND)
                  </Typography>
                </Box>
              </Stack>
              <Stack flexDirection="row" gap={1.25}>
                <Typography variant="h4">FLG</Typography>
                <Box>
                  <Typography variant="h5">Vietnam</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Dong (VND)
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
          <Stack>
            <Typography variant="h5">Choose a language and region</Typography>
          </Stack>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default HeaderLanguage;
