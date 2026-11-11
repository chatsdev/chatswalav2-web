"use client";

import { Input } from "@/src/elements/ui/input";
import { useReactFlow } from "@xyflow/react";
import { Package } from "lucide-react";
import { useState, useEffect } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useGetShopifyProductsQuery } from "@/src/redux/api/shopifyApi";

export function SendShopifyNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);
  const { data: resData, isLoading: loading } = useGetShopifyProductsQuery({ limit: 100 });

  const productList = resData?.data?.products 
    ? resData.data.products 
    : (Array.isArray(resData?.data) ? resData.data : []);

  const products = productList.map((p: any) => ({
    label: p.name || p.product_external_id || p._id,
    value: p._id
  }));

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.product_id)
      errors.push("A product is required.");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node,
      ),
    );
  };



  return (
    <BaseNode
      id={id}
      title="Shopify Product"
      icon={<Package size={18} />}
      iconBgColor="bg-green-600"
      iconColor="text-white"
      borderColor="border-green-200"
      handleColor="bg-green-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField
          label="Step Name"
          description="Identify this step in your flow report."
        >
          <Input
            placeholder="e.g. Send Shopify Product"
            value={data.name || ""}
            onChange={(e) => updateNodeData("name", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <NodeField
          label="Product"
          required
          description={loading ? "Loading products..." : "Pick the product this node will send."}
          error={
            (touched || data.forceValidation) && !data.product_id
              ? "Product is required."
              : ""
          }
        >
          <div onFocus={() => setTouched(true)}>
            <Select
              value={data.product_id || ""}
              onValueChange={(val) => updateNodeData("product_id", val)}
            >
              <SelectTrigger className="bg-gray-50 dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color)">
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </NodeField>
      </div>
    </BaseNode>
  );
}
