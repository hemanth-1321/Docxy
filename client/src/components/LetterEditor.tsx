import { useEffect, useState } from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { BACKEND_URL } from "@/lib/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Letter {
  id?: string;
  title: string;
  content: string;
}

interface LetterEditorProps {
  selectedLetter: Letter | null;
  refreshLetters: () => void;
}

const LetterEditor: React.FC<LetterEditorProps> = ({ selectedLetter, refreshLetters }) => {
  const [letterId, setLetterId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (selectedLetter) {
      setLetterId(selectedLetter.id || null);
      setTitle(selectedLetter.title);
      setText(selectedLetter.content);
    } else {
      setLetterId(null);
      setTitle("");
      setText("");
    }
  }, [selectedLetter]);

  const handleTextChange = (e: EditorTextChangeEvent) => {
    setText(e.htmlValue || "");
  };

  const handleSave = async () => {
    if (!token) {
      toast.warn("User not authenticated!", { position: "top-right" });
      return;
    }

    setLoading(true); // Start loading

    try {
      const url = letterId
        ? `${BACKEND_URL}/letters/update/${letterId}`
        : `${BACKEND_URL}/letters/upload`;

      const method = letterId ? "put" : "post";

      await axios({
        method,
        url,
        data: { title, content: text },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(letterId ? "Letter updated successfully!" : "Letter created successfully!", {
        position: "top-right",
      });

      refreshLetters();
    } catch (error) {
      console.error("Error saving letter:", error);
      toast.error("Failed to save letter.", { position: "top-right" });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <ToastContainer /> {/* Toast container for notifications */}

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading}
      />

      <div>
        <h2 className="text-lg font-semibold mb-2">Editor</h2>
        <Editor value={text} onTextChange={handleTextChange} style={{ height: "320px" }} />
      </div>

      <button
        onClick={handleSave}
        className={`px-4 py-2 rounded-lg transition flex items-center justify-center ${
          letterId ? "bg-green-500 hover:bg-green-600" : "bg-blue-950 hover:bg-blue-900"
        } text-white`}
        disabled={loading}
      >
        {loading ? <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="4" /> : letterId ? "Update" : "Save"}
      </button>
    </div>
  );
};

export default LetterEditor;
