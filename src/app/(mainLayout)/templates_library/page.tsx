import { ROUTES } from "@/src/constants";
import { redirect } from "next/navigation";

const Page = () => {
  redirect(`${ROUTES.MessageTemplates}?tab=explore`);
};

export default Page;
