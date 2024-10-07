import Sidebar from "../components/Sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex flex-col h-full">
      <Sidebar />
      {children}
    </main>
  )
}
