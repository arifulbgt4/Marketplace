export interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AvatarPopProps {
  handleCloseUserMenu: () => void;
  handleCloseNavAvatar: () => void;
  anchorElAvat: any;
  handleOpenNavAvatar: (event: React.MouseEvent<HTMLElement>) => void;
}
