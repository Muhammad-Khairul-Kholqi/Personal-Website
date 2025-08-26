'use client'

import Image from "next/image";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginUser } from "@/app/api/authApi";
import Swal from "sweetalert2";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            return Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'Email and password are required!',
                confirmButtonColor: '#000000'
            });
        }

        setIsLoading(true);

        const { ok, data } = await LoginUser(formData.email, formData.password);

        if (ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Login successful! Welcome back.',
                confirmButtonColor: '#000000',
                timer: 2000,
                showConfirmButton: false
            });

            router.push('/pages/private/cms/dashboard');
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Login Failed!',
                text: data.error || 'Incorrect email or password.',
                confirmButtonColor: '#000000'
            });
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <Image
                    width={800}
                    height={600}
                    alt="Login Illustration"
                    src="https://img.freepik.com/free-vector/access-control-system-abstract-concept-vector-illustration-security-system-authorize-entry-login-credentials-electronic-access-password-passphrase-pin-verification-abstract-metaphor_335657-5746.jpg?t=st=1755260628~exp=1755264228~hmac=40a2ff4b1bdf32c54d86966d45181f3510148b91a1f77f0f99910499d3908f67&w=1480"
                    className="w-full max-w-[500px] rounded-lg object-contain"
                    unoptimized
                    draggable="false"
                />
            </div>

            <div className="flex-1 flex items-center justify-center bg-black p-8">
                <form onSubmit={handleLogin} className="w-full bg-white rounded-xl p-10 max-w-lg space-y-6">
                    <h2 className="text-2xl font-semibold text-center">Welcome back</h2>
                    <p className="text-center text-gray-600 -mt-5">Login to access your account</p>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md outline-none focus:border-black focus:ring-1 focus:ring-black"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-10 pr-12 py-2 w-full border border-gray-200 rounded-md outline-none focus:border-black focus:ring-1 focus:ring-black"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black hover:bg-black/80 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white py-2 rounded-md transition-colors flex items-center justify-center"
                    >
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
