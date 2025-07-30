import Introduction from "@/app/components/section/home/introduce";
import Services from "@/app/components/section/home/services";
import CardContact from "@/app/components/section/home/cardContact";

export default function Home() {
  return (
    <div>
      <Introduction />
      <hr className="border-t border-dashed border-gray-500 my-5" /> 
      <Services />
      <CardContact />
    </div>
  );
}