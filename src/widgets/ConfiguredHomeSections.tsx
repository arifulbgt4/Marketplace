import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

export type ConfiguredHomeSection = {
  id: string;
  sectionKey: string;
  sectionType: string;
  content: unknown;
};

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export default function ConfiguredHomeSections({
  sections,
}: {
  sections: ConfiguredHomeSection[];
}) {
  if (!sections.length) return null;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {sections.map((section) => {
          const content = object(section.content);
          const items = Array.isArray(content.items) ? content.items : [];
          return (
            <Paper
              component="section"
              aria-labelledby={`${section.id}-title`}
              key={section.id}
              variant="outlined"
              sx={{
                p: { xs: 3, md: 5 },
                overflow: "hidden",
                bgcolor:
                  section.sectionType === "announcement"
                    ? "primary.50"
                    : "background.paper",
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={content.imageUrl ? 7 : 12}>
                  <Typography id={`${section.id}-title`} variant="h4">
                    {text(content.title)}
                  </Typography>
                  {content.body ? (
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {text(content.body)}
                    </Typography>
                  ) : null}
                  {content.linkUrl && content.linkLabel ? (
                    <Button
                      LinkComponent={Link}
                      href={text(content.linkUrl)}
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      {text(content.linkLabel)}
                    </Button>
                  ) : null}
                  {items.length ? (
                    <Grid container spacing={2} mt={1}>
                      {items.map((item, index) => {
                        const entry = object(item);
                        return (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box>
                              <Typography fontWeight={600}>
                                {text(entry.title)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {text(entry.body)}
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : null}
                </Grid>
                {content.imageUrl ? (
                  <Grid item xs={12} md={5}>
                    <Box
                      component="img"
                      src={text(content.imageUrl)}
                      alt={text(content.imageAlt) || text(content.title)}
                      loading="lazy"
                      sx={{
                        display: "block",
                        width: "100%",
                        maxHeight: 320,
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />
                  </Grid>
                ) : null}
              </Grid>
            </Paper>
          );
        })}
      </Stack>
    </Container>
  );
}
