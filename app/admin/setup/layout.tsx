import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Setup - Mahi's Vriksham Boutique",
  description: "Create your admin account",
}

export default function AdminSetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
