export const PRODUCT_SORT_VALUES = [
  "newest",
  "oldest",
  "name_asc",
  "name_desc",
  "price_asc",
  "price_desc",
] as const;

export type ProductSort = (typeof PRODUCT_SORT_VALUES)[number];

export interface ProductSearchFormValues {
  query?: string;
  minPrice?: string;
  sort?: string;
}

export interface ProductCategoryShortcut {
  id: string;
  name: string;
}

export interface ProductShortcutFallback {
  query: string;
  label: string;
}

export interface ResolvedProductShortcut {
  href: string;
  label: string;
}

export const DEFAULT_PRODUCT_SORT: ProductSort = "newest";

function isProductSort(value: unknown): value is ProductSort {
  return PRODUCT_SORT_VALUES.includes(value as ProductSort);
}

export function normalizeProductSort(value: unknown): ProductSort {
  return isProductSort(value) ? value : DEFAULT_PRODUCT_SORT;
}

function normalizeMinimumPrice(value: string | undefined) {
  const candidate = value?.trim();
  if (!candidate || !/^\d+(?:\.\d{1,2})?$/.test(candidate)) return null;

  const amount = Number(candidate);
  if (!Number.isFinite(amount) || amount < 0 || amount > 999_999.99) {
    return null;
  }

  return candidate;
}

export function buildProductSearchUrl(values: ProductSearchFormValues) {
  const params = new URLSearchParams();
  const query = values.query?.trim().slice(0, 100);
  const minimumPrice = normalizeMinimumPrice(values.minPrice);
  const sort = normalizeProductSort(values.sort);

  if (query) params.set("query", query);
  if (minimumPrice) params.set("minPrice", minimumPrice);
  params.set("sort", sort);

  return `/products?${params.toString()}`;
}

export function buildProductShortcutUrl(query: string) {
  const params = new URLSearchParams({ query: query.trim().slice(0, 100) });
  return `/products?${params.toString()}`;
}

export function buildProductCategoryUrl(categoryId: string) {
  const params = new URLSearchParams({ categoryId: categoryId.trim() });
  return `/products?${params.toString()}`;
}

export function resolveProductShortcuts(
  activeCategories: readonly ProductCategoryShortcut[],
  fallbacks: readonly ProductShortcutFallback[],
): ResolvedProductShortcut[] {
  return fallbacks.map((fallback, index) => {
    const category = activeCategories[index];
    if (category?.id.trim() && category.name.trim()) {
      return {
        href: buildProductCategoryUrl(category.id),
        label: category.name.trim(),
      };
    }

    return {
      href: buildProductShortcutUrl(fallback.query),
      label: fallback.label,
    };
  });
}
