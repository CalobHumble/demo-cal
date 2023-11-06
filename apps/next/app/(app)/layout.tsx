import { Providers } from "../providers";
import NavSidebar from "@/components/navsidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavSidebar>
            {children}
          </NavSidebar>
        </Providers>
      </body>
    </html>
  );
}