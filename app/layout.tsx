import "./globals.css"

export const metadata = {
  title: "LEVX Intelligence",
  description: "InsightPilot by LEVX Intelligence",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}