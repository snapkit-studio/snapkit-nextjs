export const metadata = {
  title: 'Snapkit External Test App',
  description: 'Testing Snapkit packages in external Next.js app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
