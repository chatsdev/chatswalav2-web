import FormBuilderList from "@/src/components/form-builder/FormBuilderList";
import { Metadata } from "next";
import WabaGuard from "@/src/shared/WabaGuard";

export const metadata: Metadata = {
  title: "Whatsapp Form",
  description: "Create and manage custom forms and Meta Flows",
};

export default function FormBuilderPage() {
  return (
    <WabaGuard>
      <FormBuilderList />
    </WabaGuard>
  );
}
