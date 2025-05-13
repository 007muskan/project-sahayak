"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Registration failed");
      return;
    }

    router.push("/dashboard");
  } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong");
  }
};

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#2B2738]">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[url('/bg.png')] bg-cover">
        <div className="p-3 mt-[-130px]">
          <Image src="/hindi-sahayak.png" alt="chat icon" width={300} height={300} />
        </div>
        <p className="text-[55px] text-white font-semibold text-center mb-4 leading-tight mt-[-70px]">
          An AI Assistant For <br /> Government Job Opportunities
        </p>
        <div className="p-3">
          <Image src="/logo.png" alt="logo" width={120} height={120} className="animate-bounce-custom" />
          <style jsx>{`
            @keyframes smoothBounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 h-screen bg-[#2B2738] text-white flex items-center justify-center">
        <div className="w-3/4 max-w-md">
          <h2 className="text-3xl font-semibold mb-8 ml-27">Create Account</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-transparent border-b-2 border-white outline-none py-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">E-mail</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent border-b-2 border-white outline-none py-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full bg-transparent border-b-2 border-white outline-none py-2 mb-3"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2/4 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#a56eff] hover:bg-purple-700 text-white py-2 rounded-full w-full mb-5"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <a href="/" className="text-purple-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

