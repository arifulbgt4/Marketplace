import { FC } from "react";

import { DashboardHelpInfoProps } from "./Types";
import Info from "src/components/Info";
import BannerCreateListing from "../BannerCreateListing";

const DashboardHelpInfo: FC<DashboardHelpInfoProps> = () => {
  return (
    <Info title="Begin Upload">
      <BannerCreateListing />
    </Info>
  );
};

export default DashboardHelpInfo;
