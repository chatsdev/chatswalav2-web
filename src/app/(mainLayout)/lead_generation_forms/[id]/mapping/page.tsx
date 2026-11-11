import FormMapping from "@/src/components/facebook-leads/FormMapping";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Mapping",
  description: "Map Facebook Lead form fields to contact fields and configure automated responses.",
};

const Page = () => {
  return <FormMapping />;
};

export default Page;
