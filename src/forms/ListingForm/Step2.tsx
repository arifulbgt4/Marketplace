import { FC } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Bed, CheckCircle, CheckCircleOutline } from "@mui/icons-material";

import { CheckboxGroup } from "src/components/Input";

import { Step2Props } from "./Types";

const Step2: FC<Step2Props> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          Price Information
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CheckboxGroup
          name="aminities"
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
          renderContainer={({ checkbox }) => (
            <>
              <Typography variant="h4">Aminities</Typography>
              <Stack direction="row" flexWrap="wrap" gap={3} mr={-3}>
                {checkbox}
              </Stack>
            </>
          )}
          renderCheckbox={({ label, checked, onClick }) => (
            <Stack
              onClick={onClick}
              flex={1}
              sx={(theme) => ({
                position: "relative",
                cursor: "pointer",
                maxWidth: `calc(${100 / 2}% - ${theme.spacing(3)})`,
                flexBasis: `calc(${100 / 2}% - ${theme.spacing(3)})`,
              })}
            >
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
            </Stack>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Step2;
