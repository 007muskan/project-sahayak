import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function CategoryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({});
  const [step, setStep] = useState(1); // Step 1: Category Selection, 2: Dynamic Form

  type FormDataType = {
  name?: string;
  degree?: string;
  interest?: string;
  state?: string;
  companyName?: string;
  startupType?: string;
};

  const categories = [
    { icon: "🎓", title: "Internship" },
    { icon: "🏛️", title: "Govt Scheme" },
    { icon: "🚀", title: "Startup Scheme" },
    { icon: "📚", title: "Scholarship" },
    { icon: "🛠️", title: "Skill Training" },
  ];

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setStep(2); // Go to step 2: Show the dynamic form
  };

  // Handle form field changes dynamically
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = () => {
    console.log(formData); // You can send form data to a backend or process it here
    alert("Form submitted!");
    onClose(); // Close modal after submission
  };

  // Define dynamic form fields based on the selected category
  const renderFormFields = () => {
    switch (selectedCategory) {
      case "Internship":
        return (
          <>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleFormChange}
              placeholder="Name"
              className="w-full p-3 rounded-xl bg-[#2B2738] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
  type="text"
  name="degree"
  value={formData.degree || ""}
  onChange={handleFormChange}
  placeholder="Your Degree (e.g., B.Tech, B.Sc, MBA)"
  className="w-full p-3 rounded-xl bg-[#2B2738] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
/>

           <input
  type="text"
  name="interest"
  value={formData.interest || ""}
  onChange={handleFormChange}
  placeholder="Field of Interest (e.g., AI, Marketing, Finance)"
  className="w-full p-3 rounded-xl bg-[#2B2738] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
/>

          </>
        );
      case "Govt Scheme":
        return (
          <>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleFormChange}
              placeholder="Name"
              className="w-full p-3 rounded-xl bg-[#2B2738] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="text"
              name="state"
              value={formData.state || ""}
              onChange={handleFormChange}
              placeholder="State"
              className="w-full p-3 rounded-xl bg-[#2B2738] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
/>
          </>
        );
      case "Startup Scheme":
        return (
          <>
            <input
              type="text"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleFormChange}
              placeholder="Company Name"
              className="w-full p-3 rounded-xl bg-[#2B2738] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
/>
            <input
              type="text"
              name="startupType"
              value={formData.startupType || ""}
              onChange={handleFormChange}
              placeholder="Startup Type"
              className="w-full p-3 rounded-xl bg-[#2B2738] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
/>
          </>
        );
      // Add more cases for other categories as needed
      default:
        return null;
    }
  };

  // Close modal on click outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Element && !event.target.closest('.modal-content')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="modal-content bg-[#1E1C2D] p-8 rounded-xl z-50 max-w-md w-full shadow-xl text-white">
        {step === 1 && (
          <>
            <Dialog.Title className="text-2xl font-bold mb-6">What are you looking for today?</Dialog.Title>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.title}
                  onClick={() => { handleCategorySelect(cat.title); }}
                  className="bg-[#2B2738] hover:bg-[#3F3B5A] p-4 rounded-lg flex flex-col items-center shadow-md hover:scale-105 transition"
                >
                  <div className="text-3xl mb-1">{cat.icon}</div>
                  <div className="text-sm">{cat.title}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && selectedCategory && (
  <>
    <Dialog.Title className="text-2xl font-bold mb-4 text-center">
      Fill out the form for <span className="text-blue-400">{selectedCategory}</span>
    </Dialog.Title>
    <div className="space-y-4 mb-6">
      {renderFormFields()}
    </div>
    <div className="flex justify-between gap-4">
      <button
        onClick={() => setStep(1)}
        className="w-1/2 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-xl shadow-sm transition duration-300"
      >
        ⬅️ Back
      </button>
      <button
        onClick={handleFormSubmit}
        className="w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-xl shadow-md transition duration-300"
      >
        🚀 Submit
      </button>
    </div>
  </>
        )}
      </div>
    </Dialog>
  );
}
