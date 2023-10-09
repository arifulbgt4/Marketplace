"use client";
import { FC } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Stack, Typography, Box } from "@mui/material";

import Info from "src/components/Info";

import { ConatactHelpInfoProps } from "./Types";

const ConatactHelpInfo: FC<ConatactHelpInfoProps> = () => {
  return (
    <Info title="Frequently Asked Questions">
      <Stack gap={5} alignItems="flex-start">
        <Typography variant="h6">
          Please check the Frequently Asked Questions before you submit support
          form:
        </Typography>
        <Box pl={4}>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
              [`& .${timelineItemClasses.root}`]: {
                flex: 0,
                minHeight: 35,
              },
            }}
          >
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>Rent </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>Listing </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>Site Usage</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>General Question</TimelineContent>
            </TimelineItem>
          </Timeline>
        </Box>
      </Stack>
    </Info>
  );
};

export default ConatactHelpInfo;
