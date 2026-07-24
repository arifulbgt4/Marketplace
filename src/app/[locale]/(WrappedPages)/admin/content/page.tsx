"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ConfiguredHomeSections from "src/widgets/ConfiguredHomeSections";

type Section = {
  id: string;
  sectionKey: string;
  sectionType: string;
  locale: string;
  status: string;
  displayOrder: number;
  revision: number;
  content: unknown;
};

const sectionTypes = [
  "announcement",
  "collection",
  "rich_text",
  "image_banner",
  "trust_badges",
];

async function request(url: string, method: string, body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Request failed");
  return data;
}

export default function AdminContentPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionKey, setSectionKey] = useState("");
  const [sectionType, setSectionType] = useState("rich_text");
  const [locale, setLocale] = useState("en");
  const [displayOrder, setDisplayOrder] = useState(100);
  const [content, setContent] = useState(
    '{\n  "title": "Section title",\n  "body": "Section content"\n}',
  );
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState("");
  const [previewSection, setPreviewSection] = useState<Section | null>(null);

  const load = useCallback(async () => {
    try {
      setSections(
        await request(
          `/api/admin/content?locale=${encodeURIComponent(locale)}`,
          "GET",
        ),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load content",
      );
    }
  }, [locale]);

  useEffect(() => {
    load();
  }, [load]);

  const saveDraft = async () => {
    setError("");
    setNotice("");
    try {
      const payload = {
        sectionType,
        displayOrder,
        isVisible: true,
        content: JSON.parse(content),
      };
      await request(
        editingId ? `/api/admin/content/${editingId}` : "/api/admin/content",
        editingId ? "PATCH" : "POST",
        editingId ? payload : { ...payload, sectionKey, locale },
      );
      setNotice(editingId ? "Draft updated." : "Draft revision created.");
      setEditingId("");
      setSectionKey("");
      await load();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create draft",
      );
    }
  };

  const populateEditor = (section: Section, editExisting: boolean) => {
    setSectionKey(section.sectionKey);
    setSectionType(section.sectionType);
    setLocale(section.locale);
    setDisplayOrder(section.displayOrder);
    setContent(JSON.stringify(section.content, null, 2));
    setEditingId(editExisting ? section.id : "");
    setNotice(
      editExisting
        ? `Editing draft revision ${section.revision}.`
        : `Creating a new revision from revision ${section.revision}.`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const publish = async (id: string) => {
    setError("");
    try {
      await request(`/api/admin/content/${id}/publish`, "POST");
      setNotice("Content published.");
      await load();
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "Unable to publish content",
      );
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Homepage content</Typography>
        <Typography color="text.secondary">
          Add lower homepage sections. The existing Hero and Search composition
          remains protected.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {notice ? <Alert severity="success">{notice}</Alert> : null}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Edit draft revision" : "New draft revision"}
        </Typography>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Section key"
              helperText="Lowercase slug; hero/search names are reserved"
              value={sectionKey}
              onChange={(event) => setSectionKey(event.target.value)}
              disabled={Boolean(editingId)}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Section type</InputLabel>
              <Select
                value={sectionType}
                label="Section type"
                onChange={(event) => setSectionType(event.target.value)}
              >
                {sectionTypes.map((type) => (
                  <MenuItem value={type} key={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Locale"
              value={locale}
              onChange={(event) => setLocale(event.target.value)}
              disabled={Boolean(editingId)}
            />
            <TextField
              label="Display order"
              type="number"
              value={displayOrder}
              onChange={(event) => setDisplayOrder(Number(event.target.value))}
              inputProps={{ min: 100 }}
            />
          </Stack>
          <TextField
            label="Content JSON"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            multiline
            minRows={6}
            helperText="Use title, body, imageUrl, linkUrl, linkLabel or items fields as needed."
          />
          <Button
            variant="contained"
            onClick={saveDraft}
            disabled={!sectionKey.trim()}
            sx={{ alignSelf: "flex-start" }}
          >
            {editingId ? "Save draft" : "Create draft"}
          </Button>
          {editingId ? (
            <Button
              variant="text"
              onClick={() => {
                setEditingId("");
                setSectionKey("");
                setNotice("");
              }}
              sx={{ alignSelf: "flex-start" }}
            >
              Cancel editing
            </Button>
          ) : null}
        </Stack>
      </Paper>

      {previewSection ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Preview: {previewSection.sectionKey} revision{" "}
              {previewSection.revision}
            </Typography>
            <Button onClick={() => setPreviewSection(null)}>
              Close preview
            </Button>
          </Stack>
          <ConfiguredHomeSections
            sections={[
              {
                id: `preview-${previewSection.id}`,
                sectionKey: previewSection.sectionKey,
                sectionType: previewSection.sectionType,
                content: previewSection.content,
              },
            ]}
          />
        </Paper>
      ) : null}

      <Stack spacing={2}>
        {sections.length === 0 ? (
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">
              No content revisions for this locale.
            </Typography>
          </Paper>
        ) : (
          sections.map((section) => (
            <Paper key={section.id} sx={{ p: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={2}
              >
                <Box>
                  <Typography variant="h6">{section.sectionKey}</Typography>
                  <Typography color="text.secondary">
                    {section.sectionType} · revision {section.revision} · order{" "}
                    {section.displayOrder} · {section.status}
                  </Typography>
                  <Typography
                    component="pre"
                    variant="caption"
                    sx={{ whiteSpace: "pre-wrap", mt: 1 }}
                  >
                    {JSON.stringify(section.content, null, 2)}
                  </Typography>
                </Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ alignSelf: "flex-start" }}
                >
                  <Button
                    variant="text"
                    onClick={() => setPreviewSection(section)}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="text"
                    onClick={() =>
                      populateEditor(section, section.status === "draft")
                    }
                  >
                    {section.status === "draft" ? "Edit" : "Create revision"}
                  </Button>
                  {section.status === "draft" ? (
                    <Button
                      variant="outlined"
                      onClick={() => publish(section.id)}
                    >
                      Publish
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </Stack>
  );
}
