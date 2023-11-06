import { FC } from "react";

import Info from "src/components/Info";
import SocialIconLink from "src/components/SocialILink";

import { AccountHelpInfoProps } from "./Types";

const AccountHelpInfo: FC<AccountHelpInfoProps> = () => {
  return (
    <Info title="Social Links">
      <SocialIconLink />
    </Info>
  );
};

export default AccountHelpInfo;
