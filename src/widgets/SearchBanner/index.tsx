"use client";
import { FC } from "react";
import {
  Typography,
  Box,
  Stack,
  Container,
  IconButton,
  Hidden,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";

import SearchFilterForm from "src/forms/SearchFilterForm";
import CategoryButton from "src/components/CategoryButton";

import { SearchBannerProps } from "./Types";

const SearchBanner: FC<SearchBannerProps> = () => {
  return (
    <Stack
      component="div"
      sx={(theme) => ({
        position: "relative",
        background: theme.palette.background.paper,
        mt: -10,
        pt: { md: 10 },
        minHeight: `calc(100vh - 30px)`,
      })}
      direction="column"
      justifyContent="center"
    >
      <Container
        component={Stack}
        maxWidth="md"
        position="relative"
        zIndex={999}
        mt={{ xs: 2, md: 8 }}
        mb={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          flex: 1,
        }}
      >
        <Stack justifyContent="center" gap={3}>
          <Typography
            align="center"
            variant="h1"
            sx={(theme) => ({
              backgroundcolor: "primary",
              backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main},${theme.palette.primary.main})`,
              backgroundSize: "100%",
              backgroundRepeat: "repeat",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            })}
          >
            Discover, Shop & Thrive
          </Typography>
          <Typography variant="h3" component="p" align="center">
            Explore Endless Possibilities: Over 25,000+ Listings Await You in
            Our Global Marketplace
          </Typography>
        </Stack>
        <Hidden mdDown implementation="css">
          <Stack justifyContent="center">
            <SearchFilterForm />
          </Stack>
        </Hidden>
        <Hidden mdUp implementation="css">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Stack
              height={60}
              width={220}
              maxWidth="100%"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              sx={(theme) => ({
                background: theme.palette.background.paper,
                borderRadius: 50,
                boxShadow: 10,
              })}
            >
              <Typography pl={3} color="text.secondary" variant="subtitle2">
                Find Activity
              </Typography>
              <IconButton
                size="small"
                sx={(theme) => ({
                  border: 10,
                  borderColor: "background.paper",
                  bgcolor: theme.palette.info.main,
                })}
              >
                <SearchSharpIcon
                  sx={(theme) => ({
                    transform: "rotate(90deg)",
                    height: 29,
                    width: 29,
                    color: theme.palette.info.contrastText,
                  })}
                />
              </IconButton>
            </Stack>
          </Box>
        </Hidden>
        <Stack
          gap={{ xs: 1, md: 3 }}
          flexDirection="row"
          flexWrap="wrap"
          pt={{ md: 3 }}
          justifyContent="center"
        >
          <CategoryButton
            href="#"
            text="services"
            svg={
              <svg
                viewBox="-102.4 -102.4 1228.80 1228.80"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                  <path
                    transform="translate(-102.4, -102.4), scale(38.4)"
                    d="M16,26.95480041159317C18.47059434658302,26.99819340256183,20.12377632346754,31.325714916878237,22.438805263073498,30.46179340087108C24.666874238909962,29.63032356719341,23.290198425173305,25.728804853138996,24.60155567707757,23.744875518893693C25.667132594689924,22.13278293186145,28.743763359376246,22.16398292980836,29.16950746095078,20.27903236374912C29.613008985861672,18.315462117356482,26.66623908286864,16.89765239749821,26.602548576867676,14.885627239961138C26.531646756503537,12.645791898008188,29.28949174995815,10.796718163345282,28.800120273927114,8.6098471141886C28.355392678198545,6.6224776995515535,25.864017146737858,5.880956669557988,24.296557875390807,4.580767738169365C22.644671705119606,3.210547692416723,21.384497427483183,0.432628339839654,19.2539422491713,0.6914053200446979C16.752623378282784,0.9952152145395629,16.299733848748275,5.29222500731983,13.842656614077441,5.85049735010452C11.43782933301165,6.396897984666986,9.060498732942882,2.279754098398769,6.914604172099638,3.4950254421537092C4.915008366158343,4.627444306712515,7.235010347601197,8.286320516712067,6.057257394051916,10.259554879972706C4.853964479838515,12.275579480240939,1.0182988227235612,12.090955852079599,0.42772720803294995,14.36328817685179C-0.12123656236348601,16.47552670909846,2.2753567872633793,18.25888531414706,3.5106661488325237,20.058030561072687C4.529581595743335,21.54201258238604,6.1404858114089365,22.498637211877686,7.071398076833955,24.03934928154417C8.242122349162276,25.97696368799335,7.509101188555095,29.534672972735073,9.661115015459607,30.237368780826948C11.948036360371688,30.984115861359,13.594619451883407,26.91255282184013,16,26.95480041159317"
                    fill="#b3ecff"
                    // strokewidth={0}
                  ></path>
                </g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M512.5 136.6l-389.4 283 148.7 457.8h481.4l148.7-457.8z"
                    fill="#FFFFFF"
                  ></path>
                  <path
                    d="M712.2 746.7c0-20.9-17-37.8-37.8-37.8-10.7 0-20.4 4.5-27.3 11.6l43.5 60.3c12.7-6.1 21.6-19.1 21.6-34.1zM636.5 746.7c0 18.8 13.8 34.4 31.7 37.3L637 740.7c-0.3 2-0.5 4-0.5 6z"
                    fill="#E6E6E6"
                  ></path>
                  <path
                    d="M690.6 780.8l-43.5-60.3c-5.2 5.4-8.8 12.4-10.1 20.2l31.2 43.3c2 0.3 4 0.5 6.1 0.5 5.9 0 11.4-1.3 16.3-3.7z"
                    fill="#E6E6E6"
                  ></path>
                  <path
                    d="M536.9 723c-2.3-5-8.3-7.2-13.3-4.9s-7.2 8.3-4.9 13.3c1.5 3.3 3.2 6.5 4.9 9.6 1.8 3.3 5.2 5.1 8.7 5.1 1.7 0 3.3-0.4 4.9-1.3 4.8-2.7 6.5-8.8 3.8-13.6-1.4-2.6-2.9-5.4-4.1-8.2zM526.7 687.7c-0.3-3-0.5-5.8-0.5-8.4v-0.3c0-5.5-4.4-10-9.9-10.1h-0.1c-5.5 0-10 4.4-10 9.9v0.5c0 3.4 0.2 7 0.6 10.7 0.6 5.1 4.9 8.9 9.9 8.9 0.4 0 0.8 0 1.1-0.1 5.6-0.6 9.5-5.6 8.9-11.1zM571.1 764.4c-2.5-1.6-4.9-3.4-7.2-5.3-4.3-3.5-10.6-2.9-14.1 1.4s-2.9 10.6 1.4 14.1c2.9 2.4 5.9 4.6 8.9 6.6 1.7 1.1 3.6 1.6 5.5 1.6 3.3 0 6.5-1.6 8.4-4.5 3-4.7 1.7-10.9-2.9-13.9zM613.1 777.1c-3-0.1-6.1-0.3-9-0.7-5.5-0.7-10.5 3.2-11.2 8.6-0.7 5.5 3.2 10.5 8.6 11.2 3.6 0.5 7.2 0.7 10.9 0.8h0.3c5.4 0 9.8-4.3 10-9.7 0.2-5.5-4.1-10.1-9.6-10.2zM542.7 626c-4.7-2.9-10.9-1.3-13.7 3.4-1.8 3-3.5 5.8-5.2 8.4-2.9 4.7-1.5 10.9 3.2 13.8 1.6 1 3.5 1.5 5.3 1.5 3.3 0 6.6-1.7 8.5-4.7 1.8-2.9 3.6-5.8 5.3-8.7 2.9-4.7 1.3-10.8-3.4-13.7zM573.1 541.6c-1.2 3-2.4 6.1-3.6 9.1-2.1 5.1 0.3 11 5.4 13.1 1.3 0.5 2.6 0.8 3.8 0.8 3.9 0 7.6-2.3 9.2-6.2 1.3-3.2 2.6-6.4 3.8-9.5 2-5.1-0.6-10.9-5.7-12.9-1.5-0.6-3-0.8-4.5-0.6l-4.2 1.4c-1.8 0.9-3.4 2.6-4.2 4.8z"
                    fill="#344483"
                  ></path>
                  <path
                    d="M512.5 136.6l-389.4 283 148.7 457.8h481.3l148.7-457.8-389.3-283z m10 56.8L845 427.7l-43.2 14.2L522.5 239v-45.6z m0 70.3l255.8 185.9-173.1 56.8c0.6-2.3 1.1-4.7 1.6-7 1.1-5.4-2.3-10.7-7.7-11.8s-10.7 2.3-11.8 7.7c-0.6 3-1.4 6.2-2.2 9.4-0.7 2.8-0.1 5.7 1.3 7.9L536.6 529c-3.5-4.9-8.4-8.6-14.1-10.7V263.7zM173.9 446.5l72.8 23.4c1.3-6.7 3.4-13 6.4-19l-72.9-23.4 322.3-234.2v165.2c-0.6-0.1-1.1-0.2-1.7-0.2-3.6-0.2-7.2-0.2-10.8-0.1-5.5 0.2-9.9 4.8-9.7 10.3 0.2 5.5 4.7 9.9 10.3 9.7 3.1-0.1 6.2-0.1 9.2 0.1h0.5c0.8 0 1.5-0.1 2.2-0.3v140.2c-5 1.8-9.3 4.8-12.6 8.8l-98.7-31.7c-1.1 6.7-3.1 13.1-5.9 19.1l97.6 31.4v0.2c0 7.2 2.6 13.8 6.9 18.9l-192.6 261-123.3-379.4z m139.7 390.9l193.6-262.2c1.7 0.3 3.5 0.5 5.3 0.5 1.7 0 3.4-0.2 5.1-0.4l105.1 145.6c-3.9 7.8-6.1 16.6-6.1 25.9 0 31.9 25.9 57.8 57.8 57.8 2.8 0 5.6-0.2 8.3-0.6l24.1 33.5H313.6z m322.9-90.7c0-2 0.2-4 0.5-6 1.2-7.8 4.9-14.8 10.1-20.2 6.9-7.2 16.6-11.6 27.3-11.6 20.9 0 37.8 17 37.8 37.8 0 15-8.8 28-21.6 34.1-4.9 2.4-10.4 3.7-16.3 3.7-2.1 0-4.1-0.2-6.1-0.5-17.9-2.9-31.7-18.5-31.7-37.3z m89.9 83.7l-23.9-33.2c17.7-9.9 29.7-28.8 29.7-50.5 0-31.9-25.9-57.8-57.8-57.8-15.1 0-28.8 5.8-39.1 15.3l-70.5-97.7c0.5-0.6 1-1.3 1.4-2 1.6-3 3.2-6.1 4.7-9 2.5-4.9 0.5-10.9-4.4-13.4s-10.9-0.5-13.4 4.4c-0.4 0.7-0.8 1.5-1.1 2.2l-17-23.5c4-4.7 6.5-10.6 7-17l35.3-11.6c1.3-0.8 2.7-1.3 4.2-1.4L851 446.7 726.4 830.4z"
                    fill="#344483"
                  ></path>
                  <path
                    d="M360.6 422l-0.8 0.8c5.6 3.8 10.6 8.3 14.9 13.4l0.3-0.3c3.8-4 3.7-10.3-0.3-14.1-3.9-3.9-10.2-3.8-14.1 0.2zM590.5 448.8c0.3 2.9 0.5 6 0.6 9.1 0.1 5.4 4.6 9.7 10 9.7h0.3c5.5-0.1 9.9-4.7 9.7-10.3-0.1-3.7-0.3-7.3-0.7-10.8-0.6-5.5-5.6-9.4-11-8.8-5.6 0.6-9.5 5.6-8.9 11.1zM398 412.7c2 0 4.1-0.6 5.9-1.9 2.6-1.9 5.2-3.7 7.9-5.5 4.6-3 5.9-9.2 2.8-13.9-3-4.6-9.3-5.9-13.9-2.8-2.9 1.9-5.8 3.9-8.6 6-4.5 3.3-5.5 9.5-2.2 14 2 2.7 5.1 4.1 8.1 4.1zM544.6 389.1c1.3 0.6 2.7 0.9 4 0.9 3.8 0 7.5-2.2 9.2-6 2.2-5.1 0-11-5.1-13.2-3.3-1.4-6.6-2.8-9.9-4-5.2-1.9-10.9 0.8-12.8 6-1.9 5.2 0.8 10.9 6 12.8 2.8 1.1 5.7 2.3 8.6 3.5zM579.2 415.8c1.9 2.9 5.1 4.5 8.3 4.5 1.9 0 3.8-0.5 5.5-1.7 4.6-3.1 5.8-9.3 2.8-13.9-2.1-3.1-4.4-6.2-7-9-3.7-4.1-10-4.5-14.1-0.8s-4.5 10-0.8 14.1c1.9 2.1 3.7 4.4 5.3 6.8zM441.6 388.5c1.2 0 2.4-0.2 3.6-0.7 2.9-1.1 5.9-2.2 8.8-3.2 5.3-1.7 8.1-7.3 6.5-12.6-1.7-5.3-7.3-8.2-12.6-6.5-3.3 1.1-6.7 2.3-10 3.6-5.1 2-7.7 7.8-5.7 13 1.7 4 5.4 6.4 9.4 6.4zM577.3 536.6l4.2-1.4c-1.5 0.2-2.9 0.6-4.2 1.4z"
                    fill="#344483"
                  ></path>
                  <path
                    d="M372.2 483.6c0-29.4-24-53.4-53.4-53.4-19.8 0-37.1 10.9-46.4 27l99.5 32c0.2-1.9 0.3-3.7 0.3-5.6zM265.4 483.6c0 29.4 24 53.4 53.4 53.4 20.5 0 38.4-11.7 47.3-28.7l-100.2-32.2c-0.3 2.4-0.5 4.9-0.5 7.5z"
                    fill="#FFFFFF"
                  ></path>
                  <path
                    d="M366.1 508.3c3.1-5.8 5.1-12.3 5.8-19.1l-99.5-32c-3.3 5.7-5.5 12.1-6.5 18.9l100.2 32.2z"
                    fill="#FFFFFF"
                  ></path>
                  <path
                    d="M374.7 436.2c-4.3-5.1-9.3-9.6-14.9-13.4-11.7-8-25.9-12.6-41.1-12.6-28.7 0-53.7 16.6-65.7 40.7-3 5.9-5.1 12.3-6.4 19-0.8 4.4-1.3 9-1.3 13.7 0 40.5 32.9 73.4 73.4 73.4 29.4 0 54.9-17.4 66.6-42.5 2.8-6 4.8-12.4 5.9-19.1 0.6-3.8 1-7.8 1-11.8 0-18.1-6.6-34.6-17.5-47.4z m-2.8 52.9c-0.7 6.8-2.7 13.3-5.8 19.1-8.9 17-26.8 28.7-47.3 28.7-29.4 0-53.4-24-53.4-53.4 0-2.6 0.2-5.1 0.5-7.5 1-6.8 3.2-13.2 6.5-18.9 9.2-16.1 26.5-27 46.4-27 29.4 0 53.4 24 53.4 53.4 0 2-0.1 3.8-0.3 5.6z"
                    fill="#52f6ff"
                  ></path>
                </g>
              </svg>
            }
          />
          <CategoryButton
            href="#"
            text="Real Estate"
            svg={
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-163.84 -163.84 839.68 839.68"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                  <path
                    transform="translate(-163.84, -163.84), scale(52.48)"
                    fill="#7ed0ec"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                  ></path>
                </g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <polygon
                    style={{ fill: "#b79434" }}
                    points="256,0 235.085,299.824 256,512 463.15,512 463.15,234.767 493.439,234.767 "
                  ></polygon>
                  <polygon
                    style={{ fill: "#FBE27B" }}
                    points="18.561,234.767 48.85,234.767 48.85,512 256,512 256,0 "
                  ></polygon>
                  <path
                    style={{ fill: "#288FD9" }}
                    d="M256,387.641l102.63-113.087c-7.84-22.706-20.617-42.64-34.551-59.34L256,272.836l-20.915,50.037 L256,387.641z"
                  ></path>
                  <path
                    style={{ fill: "#8BCBF1" }}
                    d="M256,272.836l-68.079-57.622c-13.934,16.699-26.711,36.633-34.551,59.34L256,387.641V272.836z"
                  ></path>
                  <g>
                    <path
                      style={{ fill: "#0079CE" }}
                      d="M324.079,215.214C292.903,177.852,256,156.651,256,156.651l-20.915,60.34L256,283.294 L324.079,215.214z"
                    ></path>
                    <path
                      style={{ fill: "#0079CE" }}
                      d="M256,377.184l-20.915,24.405L256,431.76c61.091,0,110.616-49.524,110.616-110.616 c0-16.58-2.998-32.144-7.986-46.591L256,377.184z"
                    ></path>
                  </g>
                  <g>
                    <path
                      style={{ fill: "#288FD9" }}
                      d="M256,156.651c0,0-36.903,21.201-68.079,58.563L256,283.294V156.651z"
                    ></path>
                    <path
                      style={{ fill: "#288FD9" }}
                      d="M153.37,274.553c-4.988,14.447-7.986,30.01-7.986,46.591c0,61.091,49.524,110.616,110.616,110.616 v-54.576L153.37,274.553z"
                    ></path>
                  </g>
                </g>
              </svg>
            }
          />
          <CategoryButton
            href="#"
            text="guides"
            svg={
              <svg
                viewBox="-12.16 -12.16 88.32 88.32"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                transform="rotate(0)"
              >
                <g
                  id="SVGRepo_bgCarrier"
                  strokeWidth="0"
                  transform="translate(0,0), scale(1)"
                >
                  <path
                    transform="translate(-12.16, -12.16), scale(5.52)"
                    fill="#7ed0ec"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                  ></path>
                </g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#CCCCCC"
                  strokeWidth="0.128"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g fill="none" fillRule="evenodd">
                    <path
                      fill="#ee99ff"
                      d="M1,35.0023695 C1,32.7919219 2.78716697,30.7942228 4.96428975,30.5435455 L18,29.0425936 L31.0357102,30.5435455 C33.225127,30.7956384 35,32.7918218 35,35.0023695 L35,42 L1,42 L1,35.0023695 Z"
                    ></path>
                    <path
                      fill="#f2eba1"
                      d="M12,24.3164468 C8.98979073,21.470456 7,16.8615543 7,13 C7,6.92486775 11.9248678,2 18,2 C24.0751322,2 29,6.92486775 29,13 C29,16.8615543 27.0102093,21.470456 24,24.3164468 L24,31 C24,31 19.9325778,32.4486507 18,32.4486507 C16.0674222,32.4486507 12,31 12,31 L12,24.3164468 Z"
                    ></path>
                    <circle cx="9" cy="18" r="3" fill="#f2eba1"></circle>
                    <circle cx="27" cy="18" r="3" fill="#f2eba1"></circle>
                    <path
                      fill="#b8b3ff"
                      d="M29,49.0023695 C29,46.7919219 30.787167,44.7942228 32.9642898,44.5435455 L46,43.0425936 L59.0357102,44.5435455 C61.225127,44.7956384 63,46.7918218 63,49.0023695 L63,56 L29,56 L29,49.0023695 Z"
                    ></path>
                    <path
                      fill="#f2eba1"
                      d="M40,38.3164468 C36.9897907,35.470456 35,30.8615543 35,27 C35,20.9248678 39.9248678,16 46,16 C52.0751322,16 57,20.9248678 57,27 C57,30.8615543 55.0102093,35.470456 52,38.3164468 L52,45 C52,45 47.9325778,46.4486507 46,46.4486507 C44.0674222,46.4486507 40,45 40,45 L40,38.3164468 Z"
                    ></path>
                    <circle cx="37" cy="32" r="3" fill="#f2eba1"></circle>
                    <circle cx="55" cy="32" r="3" fill="#f2eba1"></circle>
                    <polyline
                      stroke="#b8b3ff"
                      strokeDasharray="4"
                      strokeLinecap="round"
                      strokeWidth="0.00064"
                      points="46.104 55.867 46.104 60.12 18.076 60.12 18.076 42.05"
                    ></polyline>
                  </g>
                </g>
              </svg>
            }
          />
          <CategoryButton
            href="#"
            text="For Sale"
            svg={
              <svg
                version="1.1"
                id="_x36_"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-168.96 -168.96 849.92 849.92"
                fill="#000000"
                stroke="#000000"
                strokeWidth="0.00512"
              >
                <g
                  id="SVGRepo_bgCarrier"
                  strokeWidth="0"
                  transform="translate(0,0), scale(1)"
                >
                  <path
                    transform="translate(-168.96, -168.96), scale(26.56)"
                    d="M16,30.193151188393433C17.894938595089418,30.667931513388922,19.777215102442028,29.26866273346509,21.486439500464005,28.32274487584283C23.121951836873897,27.417620699542763,24.854304594478563,26.424050827351177,25.762637766819303,24.790318528258933C26.653286033295988,23.18839438370327,25.889695241940274,21.14053916707444,26.449929778375708,19.39538800924504C27.007756278084404,17.65773797426411,29.005671004401904,16.456025576475028,29.02397772227497,14.631124781383084C29.041999122215092,12.834665836233635,27.548376334939523,11.402091113814015,26.54506552770389,9.911803578957919C25.58636208823484,8.487774479340292,24.290237392380092,7.39393081588459,23.23832820106346,6.037295929619621C21.841264878066585,4.235519827704826,21.554853102165602,0.7563354672679157,19.28445072245207,0.5478742380537618C16.852497814283808,0.3245799457478933,15.829387005575812,3.9722604156265846,13.696133766496931,5.161161549650732C12.260612056466178,5.9612041126746975,10.5183628511196,5.795621807161863,8.955660444027496,6.304298393499506C6.96051575667123,6.953739633372281,4.456137288626905,6.935946650742414,3.1643914254507095,8.589357934271291C1.9135725039565397,10.190383474515492,2.8314384859776895,12.577222412263358,2.4901333837212256,14.580055800754717C2.12626730156676,16.715280658105062,0.5165799591151414,18.75663249603674,1.0751474491943416,20.849378557128688C1.6299348525408222,22.92796202952547,3.4696329197665006,24.61016421591935,5.413348664606273,25.53226367795963C7.304083669800065,26.429229057685788,9.699470427129691,25.006148157688926,11.614773117994991,25.84938083889655C13.518624913960197,26.68757214003674,13.98217550651214,29.687581577175074,16,30.193151188393433"
                    fill="#7ed0ec"
                  ></path>
                </g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#CCCCCC"
                  strokeWidth="2.048"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <g>
                      <path
                        style={{ fill: "none" }}
                        d="M403.72,106.039c0.773,9.323,3.523,16.326,7.705,19.911c4.986-7.118,4.306-16.997-2.052-23.354 c-1.732-1.732-3.726-3.039-5.854-3.929C403.461,101.2,403.523,103.665,403.72,106.039z"
                      ></path>
                      <path
                        style={{ fill: "none" }}
                        d="M445.681,111.442c6.341-7.566,12.474-17.535,17.456-29.767c13.586-33.356,9.583-62.089-2.506-67.013 c-1.357-0.553-2.845-0.833-4.424-0.833c-12.137,0-31.749,16.481-44.191,47.024c-0.902,2.215-1.728,4.433-2.492,6.648 c18.417,2.497,30.689,4.255,30.689,4.255S442.559,88.131,445.681,111.442z"
                      ></path>
                      <path
                        style={{ fill: "none" }}
                        d="M389.687,98.557c-2.227,0.891-4.315,2.236-6.119,4.04c-7.126,7.126-7.126,18.679,0,25.805 c4.317,4.317,10.258,6.014,15.856,5.1c-5.279-6.122-8.563-15.102-9.493-26.319C389.7,104.396,389.623,101.512,389.687,98.557z"
                      ></path>
                      <path
                        style={{ fill: "#F8F1C3" }}
                        d="M423.01,142.217l-5.999,5.923c-9.112,9.187-24.146,9.187-33.333,0l-19.894-19.893 c-9.187-9.187-9.187-24.147,0-33.334l29.613-29.612c0.684,0.152,1.443,0.226,2.202,0.304c-3.645,11.312-5.695,22.627-5.922,32.952 c-2.202,0.912-4.328,2.202-6.074,4.025c-7.137,7.137-7.137,18.678,0,25.817c4.252,4.327,10.25,5.997,15.793,5.087 c2.809,3.189,6.075,5.619,9.871,7.213c3.037,1.214,6.302,1.822,9.643,1.822C420.276,142.521,421.643,142.445,423.01,142.217z"
                      ></path>
                      <path
                        style={{ fill: "#F8F1C3" }}
                        d="M351.846,140.203l19.921,19.921c9.166,9.166,24.164,9.166,33.33,0l17.89-17.89l0,0l-5.941,5.941 c-9.166,9.166-24.164,9.166-33.33,0l-19.921-19.921c-9.165-9.165-9.166-24.163-0.001-33.329l-11.948,11.948 C342.681,116.039,342.681,131.037,351.846,140.203z"
                      ></path>
                      <path
                        style={{ fill: "#606052" }}
                        d="M475.934,86.864c-7.137,17.54-17.084,32.196-27.942,42.066c-0.456-3.568-0.911-6.985-1.367-10.325 c-0.304-2.43-0.608-4.861-0.911-7.137c6.302-7.593,12.453-17.54,17.388-29.766c13.591-33.408,9.643-62.11-2.506-67.045 c-1.291-0.532-2.809-0.836-4.404-0.836c-12.149,0-31.739,16.476-44.191,47c-0.911,2.278-1.747,4.481-2.506,6.683 c-4.328-0.608-8.96-1.216-13.895-1.898c1.063-3.342,2.278-6.683,3.569-9.947C412.532,22.855,435.994,0,456.192,0 c1.594,0,3.189,0.152,4.632,0.38c1.746,0.304,3.417,0.758,5.011,1.442c7.973,3.264,13.819,10.403,16.933,20.501 c1.215,3.873,2.05,8.277,2.43,12.984C486.488,50.797,483.223,69.097,475.934,86.864z"
                      ></path>
                      <path
                        style={{ fill: "#606052" }}
                        d="M411.425,125.951c-4.182-3.585-6.932-10.588-7.705-19.911c-0.197-2.374-0.259-4.84-0.201-7.372 c-4.411-1.845-9.398-1.883-13.832-0.11c-0.064,2.955,0.013,5.839,0.244,8.626c0.93,11.217,4.214,20.197,9.493,26.319 c3.643-0.594,7.141-2.291,9.95-5.1C410.142,127.633,410.822,126.811,411.425,125.951z"
                      ></path>
                      <path
                        style={{ fill: "#F8F1C3" }}
                        d="M446.633,118.587c-0.324-2.445-0.642-4.828-0.952-7.145c-3.122-23.311-5.467-39.685-5.467-39.685 s-12.272-1.758-30.689-4.255c-3.723,10.798-5.783,21.497-6.005,31.166c2.128,0.89,4.122,2.197,5.854,3.929 c6.358,6.358,7.038,16.237,2.052,23.354c-0.603,0.86-1.283,1.683-2.052,2.451c-2.809,2.809-6.307,4.506-9.95,5.1 c2.764,3.205,6.074,5.627,9.88,7.177c3.022,1.231,6.267,1.855,9.644,1.855c1.333,0,2.682-0.106,4.039-0.301L446.633,118.587 L446.633,118.587L446.633,118.587z"
                      ></path>
                      <path
                        style={{ fill: "#606052" }}
                        d="M403.519,98.667c0.222-9.669,2.283-20.368,6.005-31.166c-4.34-0.589-9.019-1.218-13.962-1.875 c-3.645,11.319-5.652,22.579-5.875,32.93C394.121,96.784,399.108,96.822,403.519,98.667z"
                      ></path>
                      <path
                        style={{ fill: "#56816d" }}
                        d="M459.912,268.87L228.629,500.154c-11.086,11.086-27.107,14.426-41.154,9.869 c-5.923-1.898-11.542-5.163-16.249-9.869L11.772,340.7c-4.632-4.709-7.897-10.251-9.795-16.174 c-4.556-13.972-1.215-30.068,9.795-41.154L243.055,52.089c5.087-5.089,93.622,5.771,150.342,13.212l-29.613,29.612l-11.921,11.998 c-9.188,9.111-9.188,24.145,0,33.257l19.894,19.971c9.187,9.187,24.146,9.187,33.333,0l17.92-17.92l23.614-23.613 c0.455,3.341,0.911,6.757,1.367,10.325C455.356,185.421,464.696,264.086,459.912,268.87z"
                      ></path>
                      <rect
                        x="418.089"
                        y="130.41"
                        transform="matrix(0.7071 -0.7071 0.7071 0.7071 35.1391 345.654)"
                        style={{ fill: "#56816d" }}
                        width="33.441"
                        height="0"
                      ></rect>
                      <g>
                        <path
                          style={{ fill: "#FDFEFE" }}
                          d="M196.055,354.67c-1.139-3.265-3.037-6.303-5.847-9.111c-2.657-2.656-5.315-4.632-8.049-5.999 c-2.809-1.29-5.695-1.898-8.656-1.746c-2.505,0-4.935,0.532-7.365,1.518c-2.43,1.064-5.163,2.734-8.201,5.013l-7.973,5.847 c-1.443,1.062-2.733,1.822-3.949,2.276c-1.215,0.456-2.43,0.76-3.569,0.76c-1.215,0-2.278-0.228-3.189-0.682 c-0.987-0.456-1.823-1.064-2.582-1.824c-1.974-1.972-3.037-4.403-3.037-7.289c0-2.884,1.519-5.847,4.556-8.883 c1.898-1.898,4.176-3.645,6.758-5.315c2.581-1.67,5.619-2.506,9.111-2.582l0.076-14.2c-4.935,0.078-9.415,1.064-13.364,3.038 c-4.024,1.898-8.049,4.859-12.073,8.883c-3.113,3.19-5.543,6.455-7.137,9.795c-1.595,3.341-2.506,6.683-2.733,9.947 c-0.152,3.265,0.304,6.453,1.518,9.491c1.215,3.113,3.189,5.923,5.771,8.503c4.936,4.937,10.099,7.367,15.49,7.215 c2.581,0,5.163-0.532,7.745-1.594c2.506-0.988,5.315-2.582,8.277-4.784l7.973-5.847c1.67-1.29,3.037-2.126,4.024-2.582 c0.987-0.378,1.974-0.606,3.113-0.682c2.43,0,4.632,0.986,6.606,2.961c2.354,2.354,3.265,5.011,2.809,7.973 c-0.532,3.036-2.506,6.227-5.847,9.643c-2.657,2.658-5.543,4.783-8.656,6.455c-3.113,1.746-6.454,2.581-10.175,2.581v14.578 c5.695,0.078,10.858-1.062,15.414-3.417c4.48-2.278,8.96-5.695,13.363-10.023c3.037-3.036,5.467-6.301,7.365-9.717 c1.822-3.418,2.961-6.835,3.417-10.251C197.421,361.201,197.118,357.858,196.055,354.67z"
                        ></path>
                        <path
                          style={{ fill: "#FDFEFE" }}
                          d="M183.602,270.465l-8.884,8.883l36.826,78.967l11.769-11.768l-6.682-13.744l20.501-20.577 l13.667,6.833l11.846-11.846L183.602,270.465z M210.254,320.123l-13.743-28.4l28.17,13.972L210.254,320.123z"
                        ></path>
                        <path
                          style={{ fill: "#FDFEFE" }}
                          d="M297.27,252.468l-26.272,26.272l-47.836-47.835l-11.313,11.312l57.934,57.86l37.51-37.509 L297.27,252.468z"
                        ></path>
                        <path
                          style={{ fill: "#FDFEFE" }}
                          d="M344.574,205.164l-26.879,26.804l-14.047-14.048l22.855-22.855l-10.099-10.097l-22.855,22.855 l-13.515-13.592l26.803-26.804l-10.098-10.099l-38.117,38.117l57.859,57.936l38.117-38.193L344.574,205.164z"
                        ></path>
                      </g>
                    </g>
                    <path
                      style={{ opacity: 0.06, fill: "#040000" }}
                      d="M423.01,142.219l-0.151,0.228l23.614-23.615L423.01,142.219z M422.782,142.447v0.076 h0.076v-0.076H422.782z M422.706,142.523l-5.847,5.847v0.076l5.923-5.923H422.706z M422.706,142.523l-5.847,5.847v0.076 l5.923-5.923H422.706z M485.197,35.309c-0.379-4.707-1.215-9.111-2.43-12.984c-0.532-1.67-1.215-3.036-1.822-4.555l-10.934,10.933 c3.113,12.528,1.595,31.89-7.062,53.227c-1.822,4.481-3.796,8.655-5.847,12.452c-0.075,0.228-0.227,0.38-0.227,0.532 c-0.684,1.214-1.367,2.354-1.974,3.416c-0.835,1.368-1.595,2.582-2.354,3.797c-1.139,1.746-2.278,3.34-3.417,4.935 c-0.531,0.76-1.139,1.52-1.746,2.278c-0.532,0.684-1.063,1.444-1.671,2.126c0.152,0.836,0.228,1.67,0.304,2.582 c-0.152-0.836-0.304-1.67-0.38-2.506c0,0.076,0,0.076-0.076,0.152c-3.189-23.311-5.467-39.711-5.467-39.711 s-4.328-0.608-11.693-1.67l-38.497,38.495c0.152,1.292,0.304,2.582,0.532,3.874c0.227,1.214,0.455,2.429,0.683,3.645 c0.304,1.214,0.608,2.354,0.912,3.417c0.303,1.138,0.683,2.202,1.063,3.264c0.38,1.064,0.836,2.05,1.291,3.036 c0.456,0.912,0.911,1.898,1.443,2.734c0.911,1.67,1.898,3.113,3.037,4.48c0.076,0.152,0.152,0.304,0.304,0.456 c-2.658,0.454-5.467,0.302-8.049-0.532c-2.809-0.836-5.467-2.354-7.669-4.557c-2.43-2.43-4.1-5.391-4.784-8.579l-11.694,11.769 h-0.076l-11.921,11.92l-62.947,62.947l-11.313,11.314l-35.383,35.461l-11.314,11.237l-20.122,20.121l-10.554,10.553l-3.568,3.568 l-11.01,11.011l-42.597,42.596l-14.351,14.352l-46.925,46.924l86.333,86.332c4.708,4.708,10.326,7.973,16.249,9.871 c14.047,4.557,30.068,1.214,41.154-9.871L459.76,269.098l0.152-0.228c0.151-0.152,0.38-0.53,0.456-0.91 c0.076-0.304,0.152-0.608,0.228-0.988c0.076-0.456,0.152-0.986,0.228-1.518c2.05-16.476-6.226-85.574-12.832-136.447v-0.076 c0.683-0.608,1.367-1.214,2.05-1.898c0.684-0.608,1.291-1.366,1.974-2.05c9.264-9.567,17.616-22.627,23.766-37.889 c0.076-0.076,0.152-0.152,0.152-0.228C483.222,69.097,486.488,50.799,485.197,35.309z M409.19,102.888 c6.378,6.303,7.062,16.172,2.05,23.309c-4.176-3.568-6.909-10.553-7.669-19.893c-0.228-2.354-0.228-4.859-0.228-7.365 C405.47,99.773,407.52,101.142,409.19,102.888z M416.024,149.28l-10.934,10.859l10.023-10.099l0.152-0.152l1.594-1.518l0.152-0.228 l5.695-5.619l-5.847,5.847v0.076L416.024,149.28z M422.706,142.523l-5.847,5.847v0.076l5.923-5.923H422.706z M422.782,142.447 v0.076h0.076v-0.076H422.782z"
                    ></path>
                  </g>
                </g>
              </svg>
            }
          />

          <CategoryButton
            href="#"
            text="booking"
            svg={
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-51.2 -51.2 614.39 614.39"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                  <path
                    transform="translate(-51.2, -51.2), scale(38.399375)"
                    fill="#7ed0ec"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                  ></path>
                </g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <circle
                    style={{ fill: "#7ed0ec" }}
                    cx="255.995"
                    cy="255.995"
                    r="255.995"
                  ></circle>
                  <path
                    style={{ fill: "#7ed0ec" }}
                    d="M511.778,266.107L407.046,161.374l-310.088,8.552l194.36,194.36l-187.03,4.998l31.431,31.431 l-23.435,20.88l83.075,83.075c19.436,4.776,39.76,7.219,60.64,7.219C393.94,511.889,506.447,402.714,511.778,266.107z"
                  ></path>
                  <path
                    style={{ fill: "#BAE6FF" }}
                    d="M247.115,171.925h11.107V394.05c-3.554,1.999-7.219,2.332-11.107,0L247.115,171.925L247.115,171.925z "
                  ></path>
                  <path
                    style={{ fill: "#E84F4F" }}
                    d="M193.139,196.692l57.309-120.615l57.42,120.615H193.139z"
                  ></path>
                  <path
                    style={{ fill: "#D14747" }}
                    d="M250.446,76.078l57.42,120.615h-57.42L250.446,76.078L250.446,76.078z"
                  ></path>
                  <path
                    style={{ fill: "#E84F4F" }}
                    d="M250.446,76.078c0,0-62.307,1.777-100.289,28.654s-56.198,56.642-56.198,56.642l36.873,16.549 L250.446,76.078z"
                  ></path>
                  <path
                    style={{ fill: "#FFFFFF" }}
                    d="M250.446,76.078c-58.197,26.322-99.734,66.082-119.614,101.845l62.307,18.659l57.309-120.615 L250.446,76.078L250.446,76.078z"
                  ></path>
                  <path
                    style={{ fill: "#D14747" }}
                    d="M250.446,76.078c0,0,62.307,1.666,100.4,28.543c37.984,26.877,56.198,56.642,56.198,56.642 l-36.873,16.549L250.446,75.967V76.078z"
                  ></path>
                  <path
                    style={{ fill: "#EBECEC" }}
                    d="M250.446,76.078c58.197,26.322,99.734,65.971,119.725,101.845l-62.306,18.658l-57.42-120.614V76.078z "
                  ></path>
                  <path
                    style={{ fill: "#FFFFFF" }}
                    d="M93.959,161.374c-1.222,8.996,16.215,26.211,36.873,16.549L93.959,161.374z"
                  ></path>
                  <path
                    style={{ fill: "#E84F4F" }}
                    d="M130.832,177.922c1.888,10.773,37.984,29.765,62.307,18.659L130.832,177.922z"
                  ></path>
                  <path
                    style={{ fill: "#FFFFFF" }}
                    d="M193.139,196.692c0,0,18.214,11.995,59.085,11.107c40.871-0.888,55.643-11.107,55.643-11.107H193.139 z"
                  ></path>
                  <path
                    style={{ fill: "#EBECEC" }}
                    d="M250.446,207.91h1.777c40.871-0.888,55.643-11.107,55.643-11.107h-57.42v11.218L250.446,207.91 L250.446,207.91z"
                  ></path>
                  <path
                    style={{ fill: "#D14747" }}
                    d="M370.173,177.922c-1.888,10.773-37.984,29.765-62.307,18.659L370.173,177.922z"
                  ></path>
                  <g>
                    <path
                      style={{ fill: "#FFFFFF" }}
                      d="M406.935,161.374c1.221,8.996-16.215,26.211-36.873,16.549L406.935,161.374z"
                    ></path>
                    <path
                      style={{ fill: "#FFFFFF" }}
                      d="M250.446,60.196c2.221,0,4.11,16.66,4.11,16.771c-1.333,1.11-6.664,1.222-8.218-0.111 c0-0.111,1.999-16.549,4.11-16.549v-0.111H250.446z"
                    ></path>
                    <path
                      style={{ fill: "#FFFFFF" }}
                      d="M105.398,356.623H327.08c3.443,0,6.331,2.887,6.331,6.331l0,0c0,3.443-2.887,6.331-6.331,6.331 H105.398c-3.443,0-6.331-2.887-6.331-6.331l0,0C99.068,359.51,101.956,356.623,105.398,356.623z"
                    ></path>
                    <path
                      style={{ fill: "#FFFFFF" }}
                      d="M323.304,357.956l101.512-73.634c4.776-0.777,8.329,6.108,3.554,9.774l-96.847,73.301 C325.192,372.171,316.863,362.62,323.304,357.956z"
                    ></path>
                  </g>
                  <path
                    style={{ fill: "#D14747" }}
                    d="M322.305,348.182l90.738-67.304c8.774-6.442,15.437,3.554,9.107,8.218l-92.182,68.415 c-1.333,1.777-4.443,3.666-8.996,3.332H106.398c-2.998,0-5.442-2.887-5.442-6.331l0,0c0-3.443,2.443-6.331,5.442-6.331h216.017 L322.305,348.182L322.305,348.182z"
                  ></path>
                  <g>
                    <path
                      style={{ fill: "#FFFFFF" }}
                      d="M111.091,416.932l76.812-56.983c0.532-0.394,1.361,0.024,1.852,0.934l2.534,4.699 c0.491,0.91,0.458,1.969-0.074,2.363l-76.812,56.983c-0.532,0.394-1.361-0.024-1.852-0.934l-2.534-4.699 C110.527,418.384,110.56,417.326,111.091,416.932z"
                    ></path>
                    <path
                      style={{ fill: "#FFFFFF" }}
                      d="M371.718,416.932l-76.812-56.983c-0.532-0.394-1.361,0.024-1.852,0.934l-2.534,4.699 c-0.491,0.91-0.458,1.969,0.074,2.363l76.812,56.983c0.532,0.394,1.361-0.024,1.852-0.934l2.534-4.699 C372.283,418.384,372.25,417.326,371.718,416.932z"
                    ></path>
                  </g>
                </g>
              </svg>
            }
          />
        </Stack>
      </Container>

      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={(theme) => ({
            borderWidth: 1,
            borderStyle: "dotted",
            borderColor: theme.palette.primary.dark,
            position: "absolute",
            top: "25%",
            bottom: "-100%",
            left: "2%",
            right: "2%",
            borderRadius: "100%",
            opacity: 0.2,
            zIndex: 9,
          })}
        >
          <Box
            sx={(theme) => ({
              borderWidth: 2,
              borderStyle: "dotted",
              borderColor: theme.palette.primary.main,
              position: "absolute",
              top: "6%",
              bottom: 0,
              left: "8%",
              right: "8%",
              borderRadius: "100%",
            })}
          >
            <Box
              sx={(theme) => ({
                borderWidth: 3,
                borderStyle: "dotted",
                borderColor: theme.palette.primary.light,
                position: "absolute",
                top: "8%",
                bottom: 0,
                left: "10%",
                right: "10%",
                borderRadius: "100%",
              })}
            >
              <Box
                sx={(theme) => ({
                  borderWidth: 2,
                  borderStyle: "dotted",
                  borderColor: theme.palette.primary.light,
                  position: "absolute",
                  top: "7%",
                  bottom: 0,
                  left: "12%",
                  right: "12%",
                  borderRadius: "100%",
                })}
              >
                <Box
                  sx={(theme) => ({
                    borderWidth: 2,
                    borderStyle: "dotted",
                    borderColor: theme.palette.primary.light,
                    position: "absolute",
                    top: "10%",
                    bottom: 0,
                    left: "14%",
                    right: "14%",
                    borderRadius: "100%",
                  })}
                ></Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -200,
          height: 400,
          // background: "#fff",
          zIndex: 9,
          backgroundImage: `linear-gradient(to top, transparent 0%, ${theme.palette.background.default} 50%, transparent 100%);`,
        })}
      ></Box>
    </Stack>
  );
};

export default SearchBanner;
