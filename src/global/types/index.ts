import { SvgIconComponent } from "@mui/icons-material";
import { User, Listing, Order, Review, Category, Message, Bookmark } from "@prisma/client";

export interface LanguageOptions {
  key: string;
  name: string;
  eng: string;
}
export interface AnyObject {
  [key: string]: any;
}

export interface CheckboxGroupOptions {
  label: string;
  value: string;
  data?: AnyObject;
}

export interface NavOptions {
  key: string;
  title: string;
  navs: NavigationOptions[];
}

export interface NavigationOptions {
  key: string;
  name: string;
  href: string;
  icon: SvgIconComponent;
  nested?: NavigationOptions[];
}

export interface UserOptions {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegisterOptions
  extends Omit<UserOptions, "id" | "role" | "createdAt" | "updatedAt"> {
  password: string;
}

export interface UserSigninOptions
  extends Pick<UserRegisterOptions, "email" | "password"> {
  callbackUrl: string;
}

export interface ListingOptions {
  id?: string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  discount?: number;
  status?: string;
  type?: string;
  images: string[];
  address: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities: string[];
  maxGuests?: number;
  userId?: string;
  categoryId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderOptions {
  id?: string;
  orderNo?: string;
  status?: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  guests?: number;
  userId?: string;
  listingId: string;
}

export interface ReviewOptions {
  id?: string;
  rating: number;
  cleanliness?: number;
  communication?: number;
  checkIn?: number;
  accuracy?: number;
  location?: number;
  value?: number;
  comment?: string;
  userId?: string;
  listingId: string;
}

export interface CategoryOptions {
  id?: string;
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
  parentId?: string;
}

export type {
  User,
  Listing,
  Order,
  Review,
  Category,
  Message,
  Bookmark,
};
