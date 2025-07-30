import Introduction from "@/app/components/section/about/introduction";
import SoftSkill from "@/app/components/section/about/softSkill";
import Career from "@/app/components/section/about/career";
import Education from "@/app/components/section/about/education";
import Technology from "@/app/components/section/about/technology";

export default function AboutPage() {
    return (
        <div>
            <Introduction />
            <hr className="border-t border-dashed border-gray-500 my-5" /> 
            <SoftSkill />
            <hr className="border-t border-dashed border-gray-500 my-5" /> 
            <Career />
            <hr className="border-t border-dashed border-gray-500 my-5" />
            <Education />
            <hr className="border-t border-dashed border-gray-500 my-5" />
            <Technology />
        </div>
    );
}
