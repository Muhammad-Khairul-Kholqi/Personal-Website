import "@/app/styles/globals.css";
import Sidebar from "@/app/components/global/sidebar";
import MobileHeader from "@/app/components/global/mobileHeader";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sora.variable}> 
      <body className={`${sora.className} font-sora overflow-hidden`}> 
        <MobileHeader />
        <div className="flex justify-center p-5 pt-20 lg:pt-5 h-screen">
          <div className="w-full max-w-[1300px] flex h-full">
            <Sidebar />
            <section className="scrollbar-hide w-full lg:max-w-[75%] p-5 overflow-y-auto h-full">
              {children}
            </section>
          </div>
        </div>
      </body>
    </html>
  );
}