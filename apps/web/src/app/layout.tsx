import type { Metadata } from "next";
import { Figtree, Forum } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SchemaMarkup from "@/frontend/components/SchemaMarkup";
import Toast from "@/frontend/components/toast/Toast";
import { LoadingProvider } from "@/frontend/features/common/hooks/use-loading";
import { NotificationProvider } from "@/frontend/providers/NotificationProvider";
import QueryProvider from "@/frontend/providers/QueryProvider";
import SessionProviderWrapper from "@/frontend/providers/SessionProviderWrapper";
import { ToastProvider } from "@/frontend/providers/ToastProvider";
import { cn } from "@/utils/cn";

const forum = Forum({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-forum",
});

const figtree = Figtree({
	subsets: ["latin"],
	weight: ["400", "500", "700"], // ambil beberapa weight
	variable: "--font-figtree",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rensa.site";

export const metadata: Metadata = {
	title: {
		default: "Rensa - Where Every Picture Tells Its Recipe",
		template: "%s | Rensa",
	},
	description:
		"Discover photography inspiration on Rensa. Explore creative photo recipes, share your vision, and learn techniques behind stunning photos.",
	keywords: [
		"photography",
		"photo sharing",
		"photo inspiration",
		"creative photos",
		"photo community",
	],
	metadataBase: new URL(siteUrl),
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://rensa.site",
		title: "Rensa - Where Every Picture Tells Its Recipe",
		description:
			"Discover photography inspiration on Rensa. Explore creative photo recipes and share your vision.",
		siteName: "Rensa",
		images: [
			{
				url: "/opengraph-image.png",
				width: 1200,
				height: 630,
				alt: "Rensa - Where Every Picture Tells Its Recipe",
				type: "image/png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		creator: "@rensaphoto",
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<SchemaMarkup />
				<Script id="maze-universal-snippet" strategy="afterInteractive">
					{`
(function (m, a, z, e) {
  var s, t, u, v;
  try {
    t = m.sessionStorage.getItem('maze-us');
  } catch (err) {}

  if (!t) {
    t = new Date().getTime();
    try {
      m.sessionStorage.setItem('maze-us', t);
    } catch (err) {}
  }

  u = document.currentScript || (function () {
    var w = document.getElementsByTagName('script');
    return w[w.length - 1];
  })();
  v = u && u.nonce;

  s = a.createElement('script');
  s.src = z + '?apiKey=' + e;
  s.async = true;
  if (v) s.setAttribute('nonce', v);
  a.getElementsByTagName('head')[0].appendChild(s);
  m.mazeUniversalSnippetApiKey = e;
})(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'a2dc0fcf-ee1d-4ede-86e3-df33616b4404');
`}
				</Script>
			</head>
			<body className={cn("antialiased", forum.variable, figtree.variable)}>
				<ToastProvider>
					<QueryProvider>
						<SessionProviderWrapper>
							<NotificationProvider>
								<LoadingProvider>{children}</LoadingProvider>
							</NotificationProvider>
						</SessionProviderWrapper>
					</QueryProvider>
					<Toast />
				</ToastProvider>
			</body>
		</html>
	);
}
