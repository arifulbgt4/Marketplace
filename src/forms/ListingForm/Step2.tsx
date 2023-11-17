import { FC } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Bed, CheckCircle, CheckCircleOutline } from "@mui/icons-material";

import { CheckboxGroup } from "src/components/Input";

import { Step2Props } from "./Types";

const Step2: FC<Step2Props> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <CheckboxGroup
          name="aminities"
          spacing={3}
          item={2}
          options={[
            { label: "dfvfdvf sdd sdd sdd", value: "sfdfsd1" },
            { label: "dfvfdvf dfvf", value: "sfdfsd2" },
            { label: "dfvfdvf SDV dsd", value: "sfdfsd3" },
            { label: "dfvfdvf dfvdf dfvf", value: "sfdfsd4" },
            { label: "dfvfdvf helo", value: "sfdfsd5" },
            { label: "dfvfdvc sdd SD f", value: "sfdfsd7" },
            { label: "dfvfdvf SD", value: "sfdfssd46" },
            { label: "dfvfdvf helo", value: "sfdfssd5" },
            { label: "dfvfdvc sdd SD f", value: "sfdfdsd7" },
            { label: "dfvfdvf SD", value: "sfdfsds46" },
            { label: "dfvfdvf helo", value: "sfdfasd5" },
            { label: "dfvfdvc sdd SD f", value: "sadfdfsd7" },
            { label: "dfvfdvf SD", value: "sfdfscsd46" },
          ]}
          renderLabel={() => <Typography variant="h5">Amenities</Typography>}
          renderCheckbox={({ label, checked }) => (
            <>
              <Box position="absolute" right={5} top={5}>
                {!checked ? <CheckCircleOutline /> : <CheckCircle />}
              </Box>

              <Stack
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.divider}`,
                })}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                borderRadius={1}
                p={2}
                gap={2}
              >
                <Bed fontSize="large" />
                <Typography variant="subtitle1">{label}</Typography>
              </Stack>
            </>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Step2;
