import { CheckboxGroupOptions, LanguageOptions } from "../types";

export const locales = ["en", "af", "am", "ar", "hy", "as", "az", "bn"];

export const languages: LanguageOptions[] = [
  {
    key: "af",
    name: "Afrikaans",
    eng: "Afrikaans",
  },
  {
    key: "am",
    name: "አማርኛ",
    eng: "Amharic",
  },
  {
    key: "ar",
    name: "العربية",
    eng: "Arabic",
  },
  {
    key: "as",
    name: "অসমীযা়",
    eng: "Assamese",
  },
  {
    key: "az",
    name: "Azərbaycanca",
    eng: "Azerbaijani",
  },
  {
    key: "bn",
    name: "বাংলা",
    eng: "Bengali",
  },
  {
    key: "en",
    name: "English",
    eng: "English",
  },
  {
    key: "hy",
    name: "Հայերեն",
    eng: "Armenian",
  },
];

export const amenities: CheckboxGroupOptions[] = [
  {
    label: "WiFi",
    value: "wifi",
    data: {
      icon: "Wifi",
    },
  },
  {
    label: "Parking",
    value: "parking",
    data: {
      icon: "LocalParking",
    },
  },
  {
    label: "Kitchen",
    value: "kitchen",
    data: {
      icon: "Restaurant",
    },
  },
  {
    label: "Air Conditioning",
    value: "air_conditioning",
    data: {
      icon: "AcUnit",
    },
  },
  {
    label: "Pool",
    value: "pool",
    data: {
      icon: "Pool",
    },
  },
  {
    label: "Gym",
    value: "gym",
    data: {
      icon: "FitnessCenter",
    },
  },
];

export const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "cabin", label: "Cabin" },
  { value: "villa", label: "Villa" },
  { value: "condo", label: "Condo" },
  { value: "other", label: "Other" },
];

export const bookingStatuses = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export const listingStatuses = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const checkbox = [
  {
    label: "show all",
    value: "show",
  },
  {
    label: "semi-detached",
    value: "sdetached",
  },
  {
    label: "flats",
    value: "flats",
  },
  {
    label: "farms/land",
    value: "farms",
  },
  {
    label: "detached",
    value: "detached",
  },
  {
    label: "terasts",
    value: "terasts",
  },
  {
    label: "banglows",
    value: "banglows",
  },
  {
    label: "parkhomes",
    value: "parkhomes",
  },
];

export const checkbox2 = [
  {
    label: "Garden",
    value: "garden",
  },
  {
    label: "Parking/garage",
    value: "parking",
  },
  {
    label: "Balcony/terrace",
    value: "balcony",
  },
  {
    label: "Pets allowed",
    value: "pets",
  },
  {
    label: "Bills included",
    value: "bills",
  },
];

export const radio = [
  { label: "Any", value: "any" },
  { label: "Unfurnished", value: "unfurnished" },
  { label: "Part furnished", value: "part_furnished" },
  { label: "Furnished", value: "furnished" },
];

export const radio2 = [
  { label: "Any", value: "any" },
  { label: "Available now", value: "available_now" },
  { label: "Available from date", value: "available_from_date" },
];

export const radio3 = [
  { label: "Any", value: "any" },
  { label: "Today", value: "today" },
  { label: "This week", value: "this_week" },
  { label: "This month", value: "this_month" },
];
