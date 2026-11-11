import GoogleSheetList from "@/src/components/google/GoogleSheetList";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GoogleSheetsPage({ params }: Props) {
  return (
    <div className="p-4 sm:p-8 pt-0!">
      <GoogleSheetList paramsPromise={params} />
    </div>
  );
}
