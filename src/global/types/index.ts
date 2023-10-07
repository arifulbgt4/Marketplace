import { SvgIconComponent } from "@mui/icons-material";
import { User } from "@prisma/client";

export interface AnyObject {
  [key: string]: any;
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
