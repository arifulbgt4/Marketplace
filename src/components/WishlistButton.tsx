"use client";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

let knownIds: Set<string> | null = null;
let idsRequest: Promise<Set<string>> | null = null;

function loadWishlistIds() {
  if (knownIds) return Promise.resolve(knownIds);
  if (!idsRequest) {
    idsRequest = fetch("/api/wishlist?ids=true")
      .then(async (response) => {
        if (!response.ok) return new Set<string>();
        const data = (await response.json()) as { productIds?: string[] };
        knownIds = new Set(data.productIds ?? []);
        return knownIds;
      })
      .finally(() => {
        idsRequest = null;
      });
  }
  return idsRequest;
}

export default function WishlistButton({ productId }: { productId: string }) {
  const t = useTranslations("Wishlist");
  const [wished, setWished] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    loadWishlistIds().then((ids) => {
      if (active) setWished(ids.has(productId));
    });
    return () => {
      active = false;
    };
  }, [productId]);

  const toggle = async () => {
    const next = !wished;
    setWished(next);
    setBusy(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, wished: next }),
      });
      if (!response.ok) throw new Error(t("updateError"));
      knownIds ??= new Set();
      if (next) knownIds.add(productId);
      else knownIds.delete(productId);
    } catch {
      setWished(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Tooltip title={wished ? t("remove") : t("add")}>
      <span>
        <IconButton
          aria-label={wished ? t("remove") : t("add")}
          onClick={toggle}
          disabled={busy}
          color={wished ? "error" : "default"}
        >
          {wished ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </span>
    </Tooltip>
  );
}
