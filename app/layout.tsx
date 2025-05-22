import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_HOST || "https://eip-explain.vercel.app";
  const miniAppEmbed = {
    version: "next",
    imageUrl: `${baseUrl}/api/og?text=EIP%20Explainer`,
    button: {
      title: "Search an EIP",
      action: {
        type: "launch_frame",
        name: "EIP Explainer",
        url: baseUrl,
        splashImageUrl: `${baseUrl}/api/og?text=EIP%20Explainer`,
        splashBackgroundColor: "#030303"
      }
    }
  };

  return {
    title: "EIP Explainer",
    description: "Understand Ethereum Improvement Proposals in simple terms",
    openGraph: {
      title: "EIP Explainer",
      description: "Understand Ethereum Improvement Proposals in simple terms",
      images: [`${baseUrl}/api/og?text=EIP%20Explainer`],
    },
    other: {
      "fc:frame": JSON.stringify(miniAppEmbed),
      "fc:frame:image": `${baseUrl}/api/og?text=EIP%20Explainer`,
      "fc:frame:button:1": "Enter EIP Number",
      "fc:frame:button:1:action": "input",
      "fc:frame:input:text": "Enter EIP number (e.g. 1559)",
      "fc:frame:post_url": `${baseUrl}/api/frame`
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
