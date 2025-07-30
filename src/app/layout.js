import "@/app/styles/globals.css";
import Sidebar from "@/app/components/global/sidebar";
import MobileHeader from "@/app/components/global/mobileHeader";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MobileHeader />
        <div className="flex justify-center p-5 pt-20 lg:pt-5">
          <div className="w-full max-w-[1300px] flex gap-5">
            <Sidebar />
            <section className="w-full lg:max-w-[75%] p-5 overflow-y-auto max-h-screen">
              {children}
            </section>
          </div>
        </div>
      </body>
    </html>
  );
}