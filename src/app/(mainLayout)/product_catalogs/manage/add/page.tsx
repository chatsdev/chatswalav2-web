"use client";

import ProductForm from "@/src/components/catalogue/ProductForm";
import { useCreateProductInCatalogMutation } from "@/src/redux/api/catalogueApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ProductPayload } from "@/src/types/components/catalogue";
import { ROUTES } from "@/src/constants";

const AddProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catalogId = searchParams.get("catalog_id");

  const [createProduct, { isLoading }] = useCreateProductInCatalogMutation();

  const handleSubmit = async (data: ProductPayload) => {
    if (!catalogId) {
      toast.error("Catalog ID is missing");
      return;
    }

    try {
      await createProduct({ catalog_id: catalogId, data }).unwrap();
      toast.success("Product created successfully");
      router.push(`${ROUTES.CataloguesManage}?catalog_id=${catalogId}`);
    } catch (error: unknown) {
      const fetchError = error as { data?: { message?: string } };
      toast.error(fetchError?.data?.message || "Failed to create product");
    }
  };

  if (!catalogId) {
    return <div>Catalog ID is required</div>;
  }

  return <ProductForm title="Add New Product" onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default AddProductPage;
