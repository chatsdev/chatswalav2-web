import GoogleFormBuilder from "@/src/components/google/GoogleFormBuilder";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GoogleFormCreatePage({ params }: Props) {
  return (
    <div className="p-4 sm:p-8 pt-0!">
      <GoogleFormBuilder paramsPromise={params} />
    </div>
  );
}
