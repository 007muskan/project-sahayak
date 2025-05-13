"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import CategoryModal from "../components/CategoryModal";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface Message {
  role: "user" | "bot";
  text: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! How can I assist you with government opportunities?" },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  // Effect to load query history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("queryHistory");
    if (saved) {
      setQueryHistory(JSON.parse(saved));
    }
  }, []); 

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn !== "true") {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("queryHistory", JSON.stringify(queryHistory));
  }, [queryHistory]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setQueryHistory((prev) => [...prev, input]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      const botMsg: Message = {
        role: "bot",
        text: data.table
          ? data.table
          : Array.isArray(data.answer)
          ? JSON.stringify(data.answer, null, 2)
          : String(data.answer ?? "No response from server"),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Fetch failed", err);
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, something went wrong." }]);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");  // Don't remove queryHistory
    router.push("/");
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const speechResult = event.results[event.resultIndex][0].transcript;
      console.log("Speech recognized:", speechResult);
      setInput(speechResult);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      alert("Speech recognition error: " + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      handleSend();
    };

    recognition.start();
  };

  return (
    <div className="h-screen flex text-white bg-[#2B2738]">
      {/* Sidebar */}
      <aside className="w-[250px] bg-[#1F1B2E] p-4 flex flex-col">
        <img 
    src="/main-logo.png"
    alt="App Logo"
    className="w-50 h-50 object-contain mt-[-45px] mb-[-30px] ml-[-10px]"
  />
        <button className="bg-[#3F3B5A] text-white py-2 px-4 rounded mb-4 hover:bg-[#4A456A]">
          + New Chat
        </button>
        <button
  onClick={() => setIsModalOpen(true)}
  className="mt-2 mb-5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
>
  Get Personalized Recommendation
</button>


    <CategoryModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSelect={(category) => {
        setSelectedCategory(category);
        // Move to next screen logic
        console.log("Selected Category:", category);
      }}
    />


        {/* History */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {queryHistory.map((query, index) => (
            <button
              key={index}
              onClick={() => setInput(query)}
              className="w-full text-left bg-[#2B2738] p-2 rounded hover:bg-[#3F3B5A] truncate"
              title={query}
            >
              {query}
            </button>
          ))}
        </div>

        <button onClick={logout} className="mt-4 bg-red-500 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`w-full p-3 rounded-md ${msg.role === "user" ? "self-end bg-[#635FC7]" : "self-start bg-[#3F3B5A]"}`}
            >
              {msg.text.startsWith("<table") ? (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} className="overflow-x-auto border border-gray-600 rounded-lg shadow-lg" />
              ) : (
                msg.text
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-[#1F1B2E] p-4">
          <div className="mb-2 text-sm text-gray-400">Example Prompts:</div>
          <div className="flex gap-2 flex-wrap mb-4">
            {["Find state schemes", "Internship for CS", "Scholarships for girls"].map((prompt, idx) => (
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
  className="flex items-center justify-center gap-2 px-5 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-95"
>
  Send
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12h14M12 5l7 7-7 7"
    />
  </svg>
</button>


           <div className="relative">
  {/* Pulse effect while listening */}
  {isListening && (
    <div className="absolute inset-0 animate-ping w-12 h-12 rounded-full bg-blue-500 opacity-30 z-0"></div>
  )}

  {/* Mic button */}
  <button
    onClick={startListening}
    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4A456A] hover:ring-2 hover:ring-blue-400 hover:bg-[#635FC7] transition shadow-md relative z-10"
    title="Speak"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-6 h-6 text-white"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.25v2.25m0-2.25a5.25 5.25 0 0 1-5.25-5.25M12 18.25a5.25 5.25 0 0 0 5.25-5.25M9 10.5a3 3 0 1 0 6 0v-4.5a3 3 0 1 0-6 0v4.5zM19.5 10.5v.75a7.5 7.5 0 0 1-15 0v-.75"
      />
    </svg>
  </button>
</div>
          </div>
        </div>
      </main>

      {/* Listening Modal */}
      {isListening && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#3F3B5A] text-white p-4 rounded-lg shadow-lg flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse w-10 h-10 rounded-full bg-yellow-500"></div>
            <span>Listening...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

