import "./globals.css";

export const metadata = {
  title: "SpectraY | Professional Image Processing",
  description: "Next-gen image processing engine powered by Python and Matrix operations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}