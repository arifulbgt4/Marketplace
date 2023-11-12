export interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export interface AvatarPopProps {
  handleCloseUserMenu: () => void;
  handleCloseNavAvatar: () => void;
  anchorElAvat: any;
  handleOpenNavAvatar: (event: React.MouseEvent<HTMLElement>) => void;
}
