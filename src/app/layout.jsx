import "@/app/styles/globals.css";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Khairul Kholqi | Personal Website",
  description: "Personal portfolio and blog",
  icons: {
    icon: "https://eprafgqbpruyjkesupcw.supabase.co/storage/v1/object/public/user-images/uploads/user-images/1756642833123-612061588.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className={sora.className}>
        {children}
      </body>
    </html>
  );
}