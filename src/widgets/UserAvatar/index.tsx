import { useState, FC } from "react";
import { signOut } from "next-auth/react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";

import routes from "src/global/routes";

import { UserAvatarProps } from "./Types";

const UserAvatar: FC<UserAvatarProps> = ({ userimg, gender }) => {
  const [anchorElAvat, setAnchorElAvat] = useState<HTMLElement | null>(null);

  const handleOpenNavAvatar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAvat(event.currentTarget);
  };

  const handleCloseNavAvatar = () => {
    setAnchorElAvat(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpenNavAvatar}
        sx={(theme) => ({
          p: 0,
          border: 2,
          padding: !userimg ? 0.4 : 0,
          borderColor: theme.palette.action.focus,
        })}
      >
        <Avatar
          sx={{ height: userimg ? 32 : 24, width: userimg ? 32 : 24 }}
          src={userimg && userimg}
          alt="UN"
        >
          {!userimg &&
            (gender === "male" ? (
              <SvgIcon
                sx={(theme) => ({ bgcolor: theme.palette.background.paper })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  shape-rendering="geometricPrecision"
                  text-rendering="geometricPrecision"
                  image-rendering="optimizeQuality"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  viewBox="0 0 512 469.76"
                >
                  <path
                    fill-rule="nonzero"
                    d="M139.64 191.28c3.34-9.28 8.44-12.29 15.16-12.1l-4.43-2.94c-2.4-30.05 4.64-82.18-27.99-92.05 61.74-76.3 132.9-117.79 186.33-49.92 64.37 3.38 90.19 105.67 38.85 148.73l-.3 2.54c2.01-.61 4.02-1 5.95-1.15 3.79-.29 7.42.33 10.51 1.97 3.39 1.81 5.98 4.74 7.31 8.89 1.28 3.97 1.33 9.04-.35 15.27l-8.03 22.78c-1.3 3.7-2.49 6.3-5.08 8.36-2.67 2.11-5.9 2.9-10.9 2.63-.83-.04-1.66-.13-2.47-.28a55.67 55.67 0 0 1-3.68 16.32c-2.77 7.12-6.63 12.93-10.43 18.29-4.3 6.05-8.85 11.53-13.6 16.45 3.7 12.99 8.47 22.56 14.19 29.84 29.04 20.88 107.25 25.79 134.48 40.97 39.31 22 38.23 64.52 46.84 103.88H0c8.53-39.01 7.65-82.23 46.84-103.88 34.52-19.22 107.77-17.99 136.96-42.9 4.2-6.58 7.75-14.46 10.47-23.86-6.23-6.48-12.07-14.18-17.39-23.12l-.36-.57c-4.8-8.06-10.6-17.79-12.42-31.3l-1.56.03c-3.27-.04-6.42-.79-9.37-2.46-4.74-2.7-8.06-7.3-10.3-12.49l-.2-.52c-2.52-6.09-3.67-13.03-3.94-18.28-.1-1.96-.1-5.85.01-9.57v-.05c.08-3.19.25-6.28.49-8.01.08-.53.21-1.03.41-1.5zm182.93 143.68-.63-.75c-6.23-7.49-11.48-16.95-15.64-29.28-6.79 5.55-14.48 10.26-22.75 13.76l-.43.19h-.01c-10.72 4.68-21.79 6.94-32.76 6.69-5.95-.13-11.86-1-17.67-2.61l-.22-.06c-9.51-2.53-18.96-7.09-28-14.06-3.72 10.72-8.55 19.6-14.2 26.93l33.92 82.84 19.93-45.96-9.73-10.63c-7.31-10.69-3.06-23.1 8.75-25.01 5.16-.83 26.04-.95 30.82.33 10.7 2.86 13.89 14.97 7.62 24.68l-9.73 10.63 19.76 45.96 30.97-83.65zm-117.38-42.19.4.34c15.35 14.68 32.36 20.2 48.51 19.57 19.48-.77 37.89-10.37 50.85-23.65.41-.42.88-.8 1.41-1.09 4.8-4.81 9.41-10.29 13.76-16.41 3.34-4.71 6.72-9.78 8.99-15.61 2.21-5.68 3.47-12.33 2.78-20.51-.08-1.32.23-2.68 1.01-3.86a6.112 6.112 0 0 1 8.46-1.75c1.07.7 2.16 1.28 3.25 1.68.94.34 1.85.55 2.68.59 1.75.09 2.54.09 2.65 0 .19-.14.58-1.19 1.16-2.84l7.79-22.06c.99-3.72 1.06-6.4.49-8.18-.29-.9-.8-1.51-1.42-1.84-.92-.49-2.27-.66-3.84-.54-3.42.26-7.42 1.92-10.97 4.61-1.3.98-2.99 1.45-4.72 1.15-3.33-.57-5.58-3.74-5.01-7.07 5.77-33.67 3.13-55.61-4.04-70.57-6.28-13.11-16.3-21.05-27.17-26.98-24.12 18.47-41.1 20.58-58.04 22.67-14.01 1.73-27.99 3.46-46.51 16.27-8.75 6.05-14.58 13.37-17.59 21.87-3.09 8.73-3.33 18.89-.83 30.4.32 1.16.29 2.43-.16 3.65-1.14 3.17-4.66 4.81-7.83 3.67l-5.61-2.03c-7.24-2.53-12.37-3.71-14.35.84-.16 1.47-.27 3.72-.33 6.04v.05c-.09 3.35-.09 6.85-.01 8.61.21 4.15 1.08 9.55 2.97 14.13l.22.45c1.27 2.97 2.96 5.49 5.06 6.68 1.06.6 2.24.88 3.48.89 1.52.02 3.21-.3 5.01-.83.57-.2 1.18-.31 1.82-.32a6.111 6.111 0 0 1 6.26 5.96c.33 14.1 6.38 24.24 11.25 32.41l.34.57c5.44 9.14 11.44 16.81 17.83 23.04z"
                  />
                </svg>
              </SvgIcon>
            ) : (
              <SvgIcon
                sx={(theme) => ({
                  bgcolor: theme.palette.background.paper,
                  height: 40,
                  width: 40,
                })}
              >
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-14.5 -14.5 174.00 174.00"
                  fill="#000000"
                  transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke="#CCCCCC"
                    stroke-width="0.58"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g id="men_1">
                      <rect
                        style={{ fill: "#fffafa" }}
                        width="145"
                        height="145"
                      ></rect>
                      <g>
                        <path
                          style={{ fill: "#351c0e" }}
                          d="M59.757,33.977c0,0-12.741-1.952-17.64,10.583c-3.221,8.246,1.008,33.769-2.016,42.588 c4.032-8.063,5.04-10.583,5.04-10.583S44.134,90.423,41.865,93.7c5.796-12.349,5.796-9.073,5.796-9.073s0.001,10.083-2.016,14.869 c4.536-7.561,5.544-12.349,5.544-12.349s1.511,3.024-1.261,9.828c2.269-3.275,4.033-8.568,4.033-8.568s0.377,6.554,1.259,9.452 c0.505-4.286,1.765-5.545,1.765-5.545s2.142,3.652,2.771,6.551c0.631-4.158,0-7.055,0-7.055l4.056,7.227l14.341-1.054l1.764-4.788 c0,0,1.513,2.773,0,5.797c2.017-1.89,3.15-4.159,3.15-6.175c0.378,5.545,0,9.199,0,9.199c3.149-5.292,3.402-10.583,3.402-10.583 s1.133,8.188,0.881,8.565c-0.252,0.378,2.521-4.032,2.143-9.827c1.26,5.544,2.141,6.68,0.882,9.577 c3.779-5.671,2.394-10.584,2.394-10.584s2.27,2.897,2.017,6.047c2.393-6.174,1.008-9.827,1.008-9.827s3.275,2.395,2.52,6.804 c2.268-5.293,0.113-10.711,0.113-10.711s2.028,2.269,5.179,2.521c-2.394-3.149-1.89-7.686-1.89-7.686s2.268,0.63,2.394,3.528 c0.757-3.403,2.898-11.719,0-16.255c3.402,1.764,4.158,2.521,4.158,2.521s-2.394-6.048-5.544-8.316 c-1.512-6.174-3.401-12.474-7.182-14.112c4.788,1.639,7.938,2.521,9.828,1.009c-3.276-0.252-7.434-3.149-9.324-6.553 c4.788,0.379,6.804,2.269,6.804,2.269s-4.409-5.796-9.701-6.426c-5.544-5.796-13.042-10.06-18.964-8.422 C68.262,27.191,63.537,27.551,59.757,33.977z"
                        ></path>
                        <g>
                          <g>
                            <g>
                              <path
                                style={{ fill: "#e3b58c" }}
                                d="M109.374,115.395c-4.963-9.396-36.874-15.292-36.874-15.292s-31.911,5.896-36.874,15.292 C31.957,128.433,28.889,145,28.889,145H72.5h43.611C116.111,145,114.039,127.236,109.374,115.395z"
                              ></path>
                              <path
                                style={{ fill: "#d3ae92" }}
                                d="M72.5,100.103c0,0,31.911,5.896,36.874,15.292c4.665,11.842,6.737,29.605,6.737,29.605H72.5 V100.103z"
                              ></path>
                              <rect
                                x="63.813"
                                y="81.001"
                                style={{ fill: "#e3b58c" }}
                                width="17.375"
                                height="29.077"
                              ></rect>
                              <rect
                                x="72.5"
                                y="81.001"
                                style={{ fill: "#d3ae92" }}
                                width="8.688"
                                height="29.077"
                              ></rect>
                              <path
                                // style="opacity:0.1;fill:#DDAC8C;enable-background:new ;"
                                d="M63.813,94.475c1.563,4.485,7.869,7.057,12.5,7.057 c1.676,0,3.305-0.28,4.875-0.795V81.001H63.813V94.475z"
                              ></path>
                              <path
                                style={{ fill: "#e3b58c" }}
                                d="M94.838,62.653c0-18.162-10.002-28.489-22.338-28.489S50.162,44.491,50.162,62.653 c0,24.429,10.002,32.886,22.338,32.886S94.838,86.063,94.838,62.653z"
                              ></path>
                              <path
                                style={{ fill: "#d3ae92" }}
                                d="M91.438,75.247c-4.049-0.424-6.783-4.786-6.098-9.739c0.678-4.957,4.513-8.638,8.564-8.216 c4.047,0.422,6.776,4.782,6.093,9.739C99.317,71.988,95.487,75.666,91.438,75.247z"
                              ></path>
                              <path
                                style={{ fill: "#e3b58c" }}
                                d="M45.161,67.031c-0.684-4.957,2.046-9.317,6.091-9.739c4.054-0.422,7.889,3.259,8.567,8.216 c0.684,4.953-2.052,9.315-6.1,9.739C49.671,75.666,45.84,71.988,45.161,67.031z"
                              ></path>
                              <path
                                style={{ fill: "#d3ae92" }}
                                d="M94.838,62.653c0-18.162-10.002-28.489-22.338-28.489v61.375 C84.836,95.539,94.838,86.063,94.838,62.653z"
                              ></path>
                            </g>
                            <path
                              style={{ fill: "#3A526E" }}
                              d="M109.374,115.395c-2.899-5.487-14.979-9.777-24.534-12.398L72.5,128.555l-12.34-25.559 c-9.556,2.621-21.635,6.911-24.534,12.398C31.957,128.433,28.889,145,28.889,145H72.5h43.611 C116.111,145,114.039,127.236,109.374,115.395z"
                            ></path>
                            <g>
                              <path
                                style={{ fill: "#FFFFFF" }}
                                d="M87.617,106.226c-1.218-3.728-4.639-4.106-4.639-4.106l-3.729,9.393l9.203,8.554 C88.453,120.065,87.997,112.082,87.617,106.226z"
                              ></path>
                            </g>
                            <g>
                              <path
                                style={{ fill: "#FFFFFF" }}
                                d="M61.991,102.119c0,0-3.422,0.379-4.64,4.106c-0.38,5.856-0.836,13.84-0.836,13.84l9.203-8.554 L61.991,102.119z"
                              ></path>
                            </g>
                          </g>
                        </g>
                        <path
                          style={{ fill: "#161510" }}
                          d="M54.196,104.775c-8.071,2.615-16.253,6.234-18.57,10.619C31.957,128.433,28.889,145,28.889,145 h25.308L54.196,104.775L54.196,104.775z"
                        ></path>
                        <path
                          style={{ fill: "#161510" }}
                          d="M89.83,104.465V145h26.281c0,0-2.072-17.764-6.737-29.605 C106.963,110.832,98.206,107.101,89.83,104.465z"
                        ></path>
                        <path
                          style={{ fill: "#26232C" }}
                          d="M92.895,62.346c-0.212-0.323-0.492-0.595-0.844-0.818c-0.863-0.555-2.163-0.821-3.983-0.821 c-1.635,0-3.406,0.21-4.969,0.396c-0.363,0.042-0.714,0.084-1.044,0.121c-4.286,0.474-6.653,1.413-7.674,3.042 c-0.34,0.542-0.504,1.119-0.548,1.73c-0.959-0.339-1.901-0.191-2.656,0.124c-0.029-0.656-0.194-1.275-0.557-1.854 c-1.021-1.629-3.388-2.568-7.674-3.042c-0.33-0.037-0.681-0.079-1.044-0.121c-1.563-0.187-3.335-0.396-4.968-0.396 c-0.365,0-0.708,0.013-1.032,0.035c-1.947,0.127-3.166,0.646-3.796,1.604c-0.349,0.532-0.478,1.176-0.401,1.922 c0.057,0.54,0.219,1.132,0.5,1.78c2.477,5.711,5.63,8.475,9.92,8.696c0.172,0.009,0.356,0.015,0.549,0.015l0,0 c2.896,0,6.353-1.021,7.37-3.885l0.028-0.081c0.385-1.081,0.744-2.099,0.945-3.05c0.141-0.106,0.381-0.262,0.688-0.391 c0.505-0.213,1.185-0.337,1.893,0c0.116,0.054,0.231,0.118,0.348,0.199c0.189,1.007,0.572,2.088,0.981,3.241l0.029,0.081 c1.018,2.863,4.475,3.885,7.37,3.885c0.192,0,0.377-0.006,0.549-0.015c4.29-0.222,7.442-2.985,9.921-8.696 c0.276-0.636,0.437-1.222,0.496-1.756C93.376,63.536,93.247,62.884,92.895,62.346 M76.22,70.425l-0.028-0.081 c-0.453-1.275-0.869-2.449-0.988-3.457l0.018-0.02c-0.007-0.006-0.015-0.011-0.022-0.02c-0.08-0.717-0.007-1.351,0.317-1.871 c0.763-1.215,2.949-2.008,6.687-2.421c0.333-0.037,0.688-0.079,1.055-0.123c1.525-0.181,3.256-0.386,4.811-0.386 c2.01,0,3.257,0.349,3.707,1.034c0.339,0.516,0.269,1.336-0.207,2.435c-2.284,5.261-4.985,7.694-8.76,7.891 c-0.15,0.008-0.313,0.013-0.48,0.013C81.483,73.419,77.231,73.273,76.22,70.425 M68.781,70.425 c-1.013,2.849-5.265,2.994-6.107,2.994c-0.169,0-0.329-0.005-0.48-0.013c-3.775-0.196-6.476-2.63-8.76-7.891 c-0.477-1.099-0.546-1.919-0.207-2.435c0.45-0.686,1.697-1.034,3.708-1.034c1.554,0,3.283,0.205,4.809,0.386 c0.367,0.044,0.722,0.086,1.055,0.123c3.736,0.413,5.924,1.206,6.686,2.421c0.786,1.256,0.109,3.161-0.674,5.367L68.781,70.425z"
                        ></path>
                        <path
                          style={{ fill: "#FFFFFF" }}
                          d="M76.22,70.425l-0.028-0.081c-0.453-1.275-0.869-2.449-0.988-3.457l0.018-0.02 c-0.007-0.006-0.015-0.011-0.022-0.02c-0.08-0.717-0.007-1.351,0.317-1.871c0.763-1.215,2.949-2.008,6.687-2.421 c0.333-0.037,0.688-0.079,1.055-0.123c1.525-0.181,3.256-0.386,4.811-0.386c2.01,0,3.257,0.349,3.707,1.034 c0.339,0.516,0.269,1.336-0.207,2.435c-2.284,5.261-4.985,7.694-8.76,7.891c-0.15,0.008-0.313,0.013-0.48,0.013 C81.483,73.419,77.231,73.273,76.22,70.425 M68.781,70.425c-1.013,2.849-5.265,2.994-6.107,2.994c-0.169,0-0.329-0.005-0.48-0.013 c-3.775-0.196-6.476-2.63-8.76-7.891c-0.477-1.099-0.546-1.919-0.207-2.435c0.45-0.686,1.697-1.034,3.708-1.034 c1.554,0,3.283,0.205,4.809,0.386c0.367,0.044,0.722,0.086,1.055,0.123c3.736,0.413,5.924,1.206,6.686,2.421 c0.786,1.256,0.109,3.161-0.674,5.367L68.781,70.425z"
                        ></path>
                        <path
                          style={{ fill: "#351c0e" }}
                          d="M87.415,44.403c0,0,0.486,8.495-13.363,19.015c3.402-4.855,3.402-8.093,3.402-8.093 s-2.856,5.184-11.239,10.343c1.003-2.199,3.828-10.166,3.828-10.166s-5.378,7.207-8.11,11.758 c1.094-3.641,1.731-9.101,6.743-13.273c-4.556,2.199-11.573,8.723-11.299,16.991c-1.642-1.973-1.186-8.875-1.186-8.875 s-4.099,3.186-2.733,15.474c-1.457-1.517-3.189-14.564-3.189-14.564s-3.067,2.327-2.702,9.709 c-4.033-4.585-14.626-31.881,21.746-41.467c0,0,21.926-4.812,28.61,11.277c7.686,18.494,2.179,30.438-3.461,35.802 c1.275-4.854,2.46-8.798,1.73-10.998c-1.365,4.324-5.558,5.234-5.558,5.234s5.103-5.993,4.739-9.33 c-3.829,5.083-8.384,5.916-8.839,5.765c6.924-7.66,6.924-11.227,6.651-13.958c-3.007,6.298-6.379,7.739-6.379,7.739 s5.468-9.18,5.468-13.199c-3.736,5.612-4.465,5.841-6.015,7.13C88.996,53.151,88.751,47.034,87.415,44.403z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </SvgIcon>
            ))}
        </Avatar>
      </IconButton>
      <Menu
        sx={(theme) => ({
          mt: { xs: -4.6, md: 7.9 },
          right: { xs: -16, md: 0 },
          left: { xs: -16, md: 2.5 },
          mb: { xs: 6, md: 0 },
          background: "transparent",
          backdropFilter: "blur(2px)",
          top: "0px !important",
          "& .MuiMenu-paper": {
            borderTopRightRadius: { xs: 24, md: 4 },
            borderTopLeftRadius: { xs: 24, md: 4 },
            boxShadow: { xs: 15, md: 4 },
            top: { md: "0px !important" },
          },
        })}
        id="menu-appbar"
        anchorEl={anchorElAvat}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElAvat)}
        onClose={handleCloseNavAvatar}
      >
        <Stack width={{ md: 310 }} justifyContent="center" alignItems="center">
          <Box
            borderRadius={3}
            p={1}
            mt={2}
            bgcolor="background.default"
            mx={2}
          >
            <Grid
              container
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userDashboard}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <DashboardIcon />
                    </IconButton>
                    <Typography variant="caption">Dashboard</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userAccount}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={(theme) => ({
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      })}
                    >
                      <ManageAccountsIcon />
                    </IconButton>
                    <Typography variant="caption">Account</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={`${routes.merchant}/slug`}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <AccountCircleIcon />
                    </IconButton>
                    <Typography variant="caption">Profile</Typography>
                  </Stack>
                </MenuItem>
              </Grid>

              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userListing}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <ListAltIcon />
                    </IconButton>
                    <Typography variant="caption">Listing</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userBookmark}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <BookmarksIcon />
                    </IconButton>
                    <Typography variant="caption">Bookmark</Typography>
                  </Stack>
                </MenuItem>
              </Grid>

              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userOrder}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <ShoppingCartIcon />
                    </IconButton>
                    <Typography variant="caption">Order</Typography>
                  </Stack>
                </MenuItem>
              </Grid>

              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userSetting}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <SettingsIcon />
                    </IconButton>
                    <Typography variant="caption">Setting</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  disableRipple
                  onClick={() => {
                    handleCloseNavAvatar();
                    signOut();
                  }}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <LogoutIcon />
                    </IconButton>
                    <Typography variant="caption"> Log out</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
            </Grid>
          </Box>
          <Box pt={3} pb={2}>
            <Button
              href={routes.listingCreate}
              size="small"
              variant="outlined"
              endIcon={<AddIcon />}
            >
              add a Listing
            </Button>
          </Box>
        </Stack>
      </Menu>
    </>
  );
};

export default UserAvatar;
