ALTER TABLE "ProductVariant"
  ADD COLUMN "weightGrams" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "DeliveryMethod"
  ADD COLUMN "minWeightGrams" INTEGER,
  ADD COLUMN "maxWeightGrams" INTEGER;

ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_weight_check"
  CHECK ("weightGrams" >= 0);

ALTER TABLE "DeliveryMethod" ADD CONSTRAINT "DeliveryMethod_weight_check"
  CHECK (
    ("minWeightGrams" IS NULL OR "minWeightGrams" >= 0)
    AND ("maxWeightGrams" IS NULL OR "maxWeightGrams" > 0)
    AND (
      "minWeightGrams" IS NULL
      OR "maxWeightGrams" IS NULL
      OR "minWeightGrams" <= "maxWeightGrams"
    )
  );
