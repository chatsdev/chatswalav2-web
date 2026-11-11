import ShopifyConnectPage from "@/src/components/shopify/ShopifyConnectPage";

export const metadata = {
  title: "Shopify Connect",
  description: "Connect your Shopify store to sync products, orders, and automate WhatsApp messages.",
};

const ShopifyConnectRoute = () => {
  return (
    <div className="p-4 pt-0! sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <ShopifyConnectPage />
    </div>
  );
};

export default ShopifyConnectRoute;
