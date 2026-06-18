import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { TenantProvider } from "@/context/TenantContext";
import { AuthProvider } from "@/context/AuthContext";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "USAMI EDU Parvularia",
  description: "Sistema de gestión para establecimientos de educación parvularia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <TenantProvider>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
