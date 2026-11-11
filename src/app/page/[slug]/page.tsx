import DynamicPageClient from "@/src/components/landing/DynamicPageClient";
import { Metadata } from "next";
import { store } from "@/src/redux/store";
import { pageApi } from "@/src/redux/api/pageApi";

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "";

const resolveUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanUrl = url.replace(/\\/g, "/").startsWith("/") ? url.replace(/\\/g, "/") : `/${url.replace(/\\/g, "/")}`;
  const baseUrl = STORAGE_URL.endsWith("/") ? STORAGE_URL.slice(0, -1) : STORAGE_URL;
  return `${baseUrl}${cleanUrl}`;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const result = await store.dispatch(pageApi.endpoints.getPublicPageBySlug.initiate(slug));
    const page = result.data?.data;

    if (!page) {
      return {
        title: "Page Not Found",
      };
    }

    const title = page.title;
    const description = page.meta_description || "WhatsApp CRM Dynamic Page";
    const image = resolveUrl(page.meta_image);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return {
      title: "WhatsApp CRM",
    };
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DynamicPageClient slug={slug} />;
}
