"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "bot";
  text: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hello! How can I assist you with government opportunities?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn !== "true") {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text }),
      });

      const data = await res.json();
      const botMsg = { role: "bot", text: JSON.stringify(data.answer) };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    router.push("/");
  };

  return (
    <div className="h-screen flex text-white bg-[#2B2738]">
      {/* Sidebar */}
      <aside className="w-[250px] bg-[#1F1B2E] p-4 flex flex-col">
        <button className="bg-[#3F3B5A] text-white py-2 px-4 rounded mb-4 hover:bg-[#4A456A]">
          + New Chat
        </button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {/* Future: store chat history here */}
        </div>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-md p-3 rounded-md ${
                msg.role === "user"
                  ? "self-end bg-[#635FC7]"
                  : "self-start bg-[#3F3B5A]"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input + Prompts */}
        <div className="bg-[#1F1B2E] p-4">
          <div className="mb-2 text-sm text-gray-400">Example Prompts:</div>
          <div className="flex gap-2 flex-wrap mb-4">
            {[
              "Find state schemes",
              "Internship for CS",
              "Scholarships for girls",
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="bg-[#35304D] text-white px-3 py-1 rounded"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full p-3 rounded-md bg-[#2B2738] border border-gray-600 text-white"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 px-4 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
