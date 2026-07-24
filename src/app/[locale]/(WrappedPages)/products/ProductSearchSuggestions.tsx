"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  CircularProgress,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useId, useState } from "react";
import { useStorefrontSettings } from "src/contexts/StorefrontSettings";
import { formatMoney } from "src/lib/i18n";
import {
  buildSuggestionRequestUrl,
  getNextSuggestionIndex,
  SUGGESTION_DEBOUNCE_MS,
} from "./product-search-suggestions";

type Suggestion = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  category: { id: string; name: string; slug: string } | null;
  image: { url: string; alt: string | null } | null;
  minPrice: string | null;
};

type ProductSearchSuggestionsProps = {
  query: string;
  onSearch: (query: string) => void;
};

export default function ProductSearchSuggestions({
  query,
  onSearch,
}: ProductSearchSuggestionsProps) {
  const router = useRouter();
  const locale = useLocale();
  const text = useTranslations("Catalog");
  const settings = useStorefrontSettings();
  const currency = settings?.business.defaultCurrency ?? "USD";
  const listboxId = useId();
  const [input, setInput] = useState(query);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setInput(query);
    setSuggestions([]);
    setError(null);
    setActiveIndex(-1);
    setLoading(query.trim().length >= 2);
  }, [query]);

  useEffect(() => {
    const normalized = input.trim();
    if (normalized.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      setActiveIndex(-1);
      return;
    }

    setSuggestions([]);
    setLoading(true);
    setError(null);
    setActiveIndex(-1);
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(buildSuggestionRequestUrl(normalized), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(text("suggestionsUnavailable"));
        const data = (await response.json()) as {
          suggestions?: Suggestion[];
        };
        setSuggestions(data.suggestions ?? []);
        setActiveIndex(-1);
      } catch (cause: unknown) {
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setError(text("suggestionsError"));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SUGGESTION_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [input, text]);

  const isOpen = focused && input.trim().length >= 2;
  const hasSuggestionList =
    isOpen && !loading && !error && suggestions.length > 0;
  const statusId = `${listboxId}-status`;
  const activeId =
    activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  const selectSuggestion = (suggestion: Suggestion) => {
    setInput(suggestion.name);
    setFocused(false);
    router.push(`/products/${suggestion.slug}`);
  };

  const submit = () => {
    onSearch(input.trim());
    setFocused(false);
  };

  const updateInput = (value: string) => {
    setInput(value);
    setSuggestions([]);
    setError(null);
    setActiveIndex(-1);
    setLoading(value.trim().length >= 2);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocused(true);
      if (suggestions.length) {
        setActiveIndex((current) =>
          getNextSuggestionIndex(current, suggestions.length, "next"),
        );
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocused(true);
      if (suggestions.length) {
        setActiveIndex((current) =>
          getNextSuggestionIndex(current, suggestions.length, "previous"),
        );
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      const active = suggestions[activeIndex];
      if (active) selectSuggestion(active);
      else submit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <Box sx={{ position: "relative", minWidth: { xs: "100%", sm: 280 } }}>
      <TextField
        fullWidth
        size="small"
        label={text("searchProducts")}
        value={input}
        onChange={(event) => updateInput(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 100)}
        onKeyDown={handleKeyDown}
        inputProps={{
          role: "combobox",
          "aria-autocomplete": "list",
          "aria-expanded": hasSuggestionList,
          "aria-controls": hasSuggestionList ? listboxId : undefined,
          "aria-activedescendant": activeId,
          "aria-describedby":
            isOpen && !hasSuggestionList ? statusId : undefined,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: loading ? (
            <InputAdornment position="end">
              <CircularProgress
                size={18}
                aria-label={text("loadingSuggestions")}
              />
            </InputAdornment>
          ) : undefined,
        }}
      />

      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            zIndex: 10,
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            maxHeight: 360,
            overflowY: "auto",
          }}
        >
          {loading ? (
            <Typography
              id={statusId}
              role="status"
              px={2}
              py={1.5}
              color="text.secondary"
            >
              {text("loadingSuggestions")}
            </Typography>
          ) : error ? (
            <Typography
              id={statusId}
              role="alert"
              px={2}
              py={1.5}
              color="error"
            >
              {error}
            </Typography>
          ) : suggestions.length === 0 ? (
            <Typography
              id={statusId}
              role="status"
              px={2}
              py={1.5}
              color="text.secondary"
            >
              {text("noSuggestions")}
            </Typography>
          ) : (
            <List id={listboxId} role="listbox" disablePadding>
              {suggestions.map((suggestion, index) => (
                <ListItemButton
                  id={`${listboxId}-option-${index}`}
                  key={suggestion.id}
                  role="option"
                  selected={index === activeIndex}
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={suggestion.image?.url}
                      alt={suggestion.image?.alt ?? ""}
                    >
                      {suggestion.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={suggestion.name}
                    secondary={[
                      suggestion.category?.name,
                      suggestion.minPrice
                        ? text("fromPrice", {
                            price: formatMoney(
                              suggestion.minPrice,
                              currency,
                              locale,
                            ),
                          })
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
}
