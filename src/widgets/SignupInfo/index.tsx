"use client";
import { FC } from "react";
import { Paper, Stack, Typography, Button } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import Info from "src/components/Info";

import { SignupInfoProps } from "./Types";

const SignupInfo: FC<SignupInfoProps> = () => {
  return (
    <Paper>
      <Info title="Why Sign Up?">
        <Stack py={7.5} px={10} gap={5} alignItems="flex-start">
          <Typography variant="h6">
            Registering for an account is free and gives you access to:
          </Typography>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
              [`& .${timelineItemClasses.root}`]: {
                flex: 0,
                px: 7.5,
                minHeight: 50,
              },
            }}
          >
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>Rent properties</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>Listing properties</TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>Custom profile page</TimelineContent>
            </TimelineItem>
          </Timeline>
          <Button size="large" variant="outlined">
            Sign Up Now
          </Button>
        </Stack>
      </Info>
    </Paper>
  );
};

export default SignupInfo;
