import Image from "next/image";

export default function Introduction() {
    return (
        <div>
            <div>
                <h1 className="text-2xl">About</h1>
                <p className="text-[#525252]">A short story about me</p>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 mt-5">
                <Image
                    src="https://drive.google.com/uc?export=view&id=1tD2d4zcqjjlkuSkW7XDXZEd1yBoFmc-x"
                    width={250}
                    height={250}
                    alt="Khairul Kholqi"
                    className="object-cover"
                />

                <div className="space-y-4 text-md text-gray-800 text-md text-justify tracking-wide">
                    <p>
                        I’m Muhammad Khairul Kholqi, a passionate and adaptive software engineer with a strong background in both frontend and backend development. I specialize in building efficient, user-focused digital solutions that are not only functional but also visually appealing.
                    </p>

                    <p>
                        With hands-on experience as a fullstack developer and UI/UX designer, I’ve worked on various projects ranging from company profiles, marketplaces, pharmacies, to educational platforms using technologies like React, Laravel, MySQL, Next.js, Tailwind, and more.
                    </p>
                </div>
            </div>
            <div className="space-y-4 text-md text-gray-800 text-md text-justify tracking-wide mt-4">
                <p>
                    I’m also experienced in leading teams and managing projects from end to end. I design UI with Figma, develop interfaces with modern frameworks, structure clean database schemas, and handle API integrations with tools like Axios and Postman.
                </p>
                
                <p>
                    I’m a strong believer in teamwork, communication, and constant learning. I love collaborating with others to deliver high-quality software that solves real problems.
                </p>

                <p>
                    I'm currently open to exciting opportunities where I can grow and contribute whether as a frontend engineer, fullstack dev, designer, or team leader.
                </p>
            </div>
        </div>
    )
}