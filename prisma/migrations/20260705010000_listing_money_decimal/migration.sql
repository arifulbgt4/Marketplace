ALTER TABLE "Listing"
  ALTER COLUMN price TYPE DECIMAL(65,30) USING price::DECIMAL(65,30),
  ALTER COLUMN discount TYPE DECIMAL(65,30) USING discount::DECIMAL(65,30);

ALTER TABLE "Listing" ADD CONSTRAINT "Listing_money_check"
  CHECK (price >= 0 AND (discount IS NULL OR discount >= 0));

