// login.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
  alert(data.error || "Login failed");
  return;
}

// ✅ Save login state
localStorage.setItem("loggedIn", "true");


    router.push("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
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
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-[#2B2738]">
        <h2 className="text-3xl font-semibold mb-8 text-white">Login</h2>
        <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm text-white">E-mail</label>
            <input
              name="email"
              type="email"
              className="w-full bg-transparent border-b-2 border-white outline-none py-2 text-white"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-white">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent border-b-2 border-white outline-none py-2 mb-3 text-white"
                placeholder="Enter your password"
                value={formData.password}
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
            <a href="/signup" className="text-purple-400 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

