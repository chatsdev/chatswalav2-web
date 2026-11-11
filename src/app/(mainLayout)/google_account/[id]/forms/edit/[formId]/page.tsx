import GoogleFormBuilder from "@/src/components/google/GoogleFormBuilder";

export default function EditGoogleFormPage({
  params,
}: {
  params: Promise<{ id: string; formId: string }>;
}) {
  return (
    <div className="p-4 sm:p-8 pt-0!">
      <GoogleFormBuilder paramsPromise={params} />
    </div>
  );
}
