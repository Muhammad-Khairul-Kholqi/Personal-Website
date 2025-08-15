'use client'

import Image from "next/image";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <Image
                    width={800}
                    height={600}
                    alt="Ilustrasi Login"
                    src="https://img.freepik.com/free-vector/access-control-system-abstract-concept-vector-illustration-security-system-authorize-entry-login-credentials-electronic-access-password-passphrase-pin-verification-abstract-metaphor_335657-5746.jpg?t=st=1755260628~exp=1755264228~hmac=40a2ff4b1bdf32c54d86966d45181f3510148b91a1f77f0f99910499d3908f67&w=1480"
                    className="w-full max-w-[500px] rounded-lg object-contain"
                    unoptimized
                    draggable="false"
                />
            </div>

            <div className="flex-1 flex items-center justify-center bg-black p-8">
                <form className="w-full bg-white rounded-xl p-10 max-w-lg space-y-6">
                    <h2 className="text-2xl font-semibold text-center">Welcome back</h2>
                    <p className="text-center text-gray-600 -mt-5">Login to acces your account</p>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md outline-none"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-black/80 cursor-pointer text-white py-2 rounded-md transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
