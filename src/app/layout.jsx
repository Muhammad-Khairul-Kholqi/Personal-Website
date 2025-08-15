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
    icon: "https://drive.google.com/uc?export=view&id=1R8Jp_g8IaBcS635L91pQooHM7Ns7j7xh"
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