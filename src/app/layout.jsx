import "@/app/styles/globals.css";
import Sidebar from "@/app/components/global/sidebar";
import MobileHeader from "@/app/components/global/mobileHeader";
import { Sora } from "next/font/google";
import Footer from "./components/global/footer";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sora.variable}> 
      <head>
        <title>Khairul Kholqi | Personal Website</title>
        <link rel="icon" href="https://drive.google.com/uc?export=view&id=1R8Jp_g8IaBcS635L91pQooHM7Ns7j7xh" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${sora.className} font-sora overflow-hidden`}> 
        <MobileHeader />
        <div className="flex justify-center p-5 pt-20 lg:pt-5 h-screen">
          <div className="w-full max-w-[1300px] flex h-full">
            <Sidebar />
            <section className="scrollbar-hide w-full lg:max-w-[75%] p-5 overflow-y-auto h-full">
              {children}
              <Footer />
            </section>
          </div>
        </div>
      </body>
    </html>
  );
}