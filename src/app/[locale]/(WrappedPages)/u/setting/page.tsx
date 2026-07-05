import { redirect } from "next/navigation";
import UserSettingForm from "src/forms/UserSettingForm";
import { getAuthSession } from "src/lib/authz";
import { userService } from "src/lib/services/user";

export default async function Settings() {
  const session = await getAuthSession();
  if (!session) redirect("/signin");
  const profile = await userService.getProfile(session.userId);
  return (
    <UserSettingForm
      initialValues={{
        name: profile.name,
        phone: profile.phone ?? "",
        image: profile.image ?? "",
      }}
    />
  );
}
