import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Complaint Dashboard - Patna Municipal Corporation",
  description: "WhatsApp complaint management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
