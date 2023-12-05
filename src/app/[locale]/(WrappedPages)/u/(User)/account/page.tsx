"use client";
import { Grid } from "@mui/material";

import OwnerAbout from "src/widgets/OwnerAbout";
import OwnerBasicInfo from "src/widgets/OwnerBasicInfo";
import OwnerProfile from "src/widgets/OwnerProfile";
import OwnerReview from "src/widgets/OwnerReview";

const profileData = {
  name: "Ramita MR",
  src: "https://scontent.fdac151-1.fna.fbcdn.net/v/t1.6435-9/57183841_350708698896126_7610830156164235264_n.jpg?stp=c0.83.500.500a_dst-jpg_s851x315&_nc_cat=103&ccb=1-7&_nc_sid=c21ed2&_nc_eui2=AeFaElRGqUVej9W3pHRzUJYzekZmaJR7xdZ6RmZolHvF1s_RFSaCIhmJ_z_gS4uUbj4a_8ibG42oZlFVJ_U8AMvQ&_nc_ohc=0syEpE5SNx0AX9PoTQp&_nc_ht=scontent.fdac151-1.fna&oh=00_AfDtqza5S0hu-bERP7JZgHE38_hoTQVmmvTq7qJ_gepnpg&oe=657190FC",
  rating: 4.5,
  totalListing: 8,
  totalReview: 20,
  cleanliness: 80,
  communication: 60,
  checkIn: 10,
  accuracy: 100,
  location: 30,
  value: 50,
};

export default function Account() {
  return (
    <Grid container columnSpacing={10} rowSpacing={3}>
      <Grid item md={4} xs={12}>
        <OwnerProfile profileData={profileData} />
      </Grid>
      <Grid item container xs={12} md={8} rowSpacing={5}>
        <Grid item xs={12}>
          <OwnerAbout />
        </Grid>
        <Grid item xs={12}>
          <OwnerBasicInfo />
        </Grid>
        <Grid item xs={12}>
          <OwnerReview />
        </Grid>
      </Grid>
    </Grid>
  );
}
