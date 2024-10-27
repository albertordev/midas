import Menubar from '@/components/Menubar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex h-full">
      <Menubar />
      {children}
    </main>
  )
}
