import Image from "next/image";

const SOFT_SKILLS_DATA = [
    {
        id: "leadership",
        title: "Leadership",
        desc: "In leadership roles, I demonstrate decisive decision-making, accountability, and the ability to motivate and empower team members, creating an inspirational work environment and guiding towards common goals.",
    },
    {
        id: "communication",
        title: "Communication",
        desc: "I excel in effective communication, articulating ideas clearly, and attentive listening. I believe in building positive relationships and preventing misunderstandings, crucial in a work environment.",
    },
    {
        id: "adaptation",
        title: "Adaptation",
        desc: "Quickly adapting to change, my flexibility and resilience enable positive responses to new situations, learning from experiences, and staying effective in challenges.",
    },
    {
        id: "teamwork",
        title: "Team work",
        desc: "As a strong team player, I actively collaborate, contribute based on strengths, support teammates, and adapt to diverse working styles to achieve common goals.",
    },
    {
        id: "creativity",
        title: "Creativity",
        desc: "Recognized for innovative problem-solving, I enjoy thinking outside the box, generating fresh ideas, and positively contributing to team creativity.",
    },
];

const SoftSkillCard = ({ skill, backgroundImage }) => (
    <div className="relative p-6 rounded-xl w-full max-w-[500px] shrink-0 min-h-[220px] overflow-hidden">
        <Image
            src={backgroundImage}
            fill
            alt={`${skill.title} background`}
            className="object-cover -z-10"
            sizes="(max-width: 500px) 100vw, 500px"
        />
        <div className="absolute inset-0 bg-black/40 -z-5"></div>

        <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-3 drop-shadow-lg">
                {skill.title}
            </h2>
            <p className="text-md leading-relaxed text-gray-100 drop-shadow-sm">
                {skill.desc}
            </p>
        </div>
    </div>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-6">
        <h1 className="text-2xl">
            {title}
        </h1>
        <p className="text-gray-600">
            {subtitle}
        </p>
    </div>
);

export default function SoftSkillsSlider() {
    const backgroundImage = "https://drive.google.com/uc?export=view&id=1ubUUhpcNIrn767qrrELJJrJYqnJ3u9jP";

    return (
        <div className="">
            <SectionHeader
                title="Soft Skills"
                subtitle="Swipe or drag to see more"
            />

            <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 flex-nowrap pb-4">
                    {SOFT_SKILLS_DATA.map((skill) => (
                        <SoftSkillCard
                            key={skill.id}
                            skill={skill}
                            backgroundImage={backgroundImage}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}