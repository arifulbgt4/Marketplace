import { FC } from "react";

import Info from "src/components/Info";
import SocialIconLink from "src/components/SocialILink";

import { ProfileHelpInfoProps } from "./Types";

const ProfileHelpInfo: FC<ProfileHelpInfoProps> = () => {
  return (
    <Info title="Social Links">
      <SocialIconLink />
    </Info>
  );
};

export default ProfileHelpInfo;
