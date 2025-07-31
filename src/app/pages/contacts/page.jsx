import { Linkedin, Github, Instagram } from "lucide-react"

export default function ContactPage() {
    return (
        <div>
            <h1 className="text-2xl">Contact</h1>
            <p className="text-[#525252] text-sm">Let`s get in touch.</p>
            <hr className="border-t border-dashed border-gray-500 my-5" />

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center gap-3">
                <a href="https://www.linkedin.com/in/muhammad-khairul-kholqi-9b9413326/" className="border border-gray-200 p-5 rounded-xl flex items-center gap-3 hover:shadow-lg duration-300">
                    <Linkedin className="text-blue-600" />
                    <div>
                        <h2 className="text-xl">Let's connect</h2>
                        <p>Muhammad Khairul Kholqi</p>
                    </div>
                </a>

                <a href="https://www.instagram.com/khairul.kh_/" className="border border-gray-200 p-5 rounded-xl flex items-center gap-3 hover:shadow-lg duration-300">
                    <Github className="text-green-600" />
                    <div>
                        <h2 className="text-xl">Explore the code</h2>
                        <p>Irull's</p>
                    </div>
                </a>

                <a href="https://github.com/Muhammad-Khairul-Kholqi/" className="border border-gray-200 p-5 rounded-xl flex items-center gap-3 hover:shadow-lg duration-300">
                    <Instagram className="text-red-600" />
                    <div>
                        <h2 className="text-xl">Follow me</h2>
                        <p>@khairul.kh_</p>
                    </div>
                </a>
            </div>

            <div className="mt-5">
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-center gap-3">
                    <input 
                        type="text" 
                        className="border border-gray-200 py-3 px-5 outline-none rounded-lg"
                        placeholder="Name*"
                    />

                    <input
                        type="email"
                        className="border border-gray-200 py-3 px-5 outline-none rounded-lg"
                        placeholder="Email*"
                    />
                </div>

                <textarea 
                    name="" 
                    id="" 
                    placeholder="Message*"
                    className="w-full h-[200px] py-3 px-5 border border-gray-200 mt-3 rounded-lg"
                />

                <button className="py-3 px-5 bg-black hover:bg-black/90 text-white text-center rounded-lg w-full mt-3 cursor-pointer">Send Message</button>
            </div> 
        </div>
    )
}