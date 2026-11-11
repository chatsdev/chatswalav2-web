import ShopifyProductsPage from "@/src/components/shopify/ShopifyProductsPage";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


export const metadata = {
  title: "Shopify Products",
  description: "Browse products and inventory synchronized from your connected Shopify store.",
};

const ShopifyProductsRoute = () => {
  return (
    <div className="p-4 pt-0! sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <ChannelRestriction platform="shopify">
      <ShopifyProductsPage />
          </ChannelRestriction>
    </div>
  );
};

export default ShopifyProductsRoute;
