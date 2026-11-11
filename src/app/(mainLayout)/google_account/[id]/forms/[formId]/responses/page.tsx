import GoogleFormResponses from "@/src/components/google/GoogleFormResponses";

type Props = {
  params: Promise<{ id: string; formId: string }>;
};

export default async function ResponsesPage({ params }: Props) {
  return (
    <div className="p-4 sm:p-8 pt-0!">
      <GoogleFormResponses paramsPromise={params} />
    </div>
  );
}
