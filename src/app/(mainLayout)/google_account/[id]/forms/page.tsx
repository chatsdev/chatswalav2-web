import GoogleFormList from "@/src/components/google/GoogleFormList";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GoogleFormsPage({ params }: Props) {
  return (
    <div className="p-4 sm:p-8 pt-0!">
      <GoogleFormList paramsPromise={params} />
    </div>
  );
}
