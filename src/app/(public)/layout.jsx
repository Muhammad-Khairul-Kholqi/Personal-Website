import "@/app/styles/globals.css";
import Sidebar from "@/app/components/global/sidebar";
import MobileHeader from "@/app/components/global/mobileHeader";
import Footer from "@/app/components/global/footer";

export default function PublicLayout({ children }) {
  return (
    <div className="overflow-hidden">
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
    </div>
  );
}