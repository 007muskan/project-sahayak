"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return alert("No user found. Please sign up.");

    const user = JSON.parse(storedUser);
    if (user.email === form.email && user.password === form.password) {
      localStorage.setItem("loggedIn", "true");
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#2B2738]">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[url('/bg.png')] bg-cover">
        <div className="p-3 mt-[-130px]">
          <Image
            src="/hindi-sahayak.png"
            alt="chat icon"
            width={300}
            height={300}
          />
        </div>
        <p className="text-[55px] text-white font-semibold text-center mb-4 leading-tight mt-[-70px]">
          An AI Assistant For <br /> Government Job Opportunities
        </p>
        <div className="p-3">
          <Image
            src="/logo.png"
            alt="logo"
            width={120}
            height={120}
            className="animate-bounce-custom"
            style={{
              animation: "smoothBounce 2s ease-in-out infinite",
            }}
          />
          <style jsx>{`
            @keyframes smoothBounce {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }
          `}</style>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-[#2B2738]">
        <h2 className="text-3xl font-semibold mb-8">Login</h2>
        <form className="w-full max-w-sm space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 text-sm">E-mail</label>
            <input
              name="email"
              type="email"
              className="w-full bg-transparent border-b-2 border-white outline-none py-2"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent border-b-2 border-white outline-none py-2 mb-3"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
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
            className="bg-[#a56eff] hover:bg-purple-700 text-white py-2 rounded-full w-full"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-400">
            Don’t have an account yet?{" "}
            <Link href="/signup" className="text-purple-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
