import { useEffect, useState } from 'react';
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import axios from 'axios';

const LetterEditor = () => {
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);
    
     useEffect(() => {
    const savedToken = localStorage.getItem("authToken"); 
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);
  const handleTextChange = (e: EditorTextChangeEvent) => {
    const newText = e.htmlValue || '';
    setText(newText);
    console.log("Editor Content:", newText);
  };

  const handleSend = async () => {
    console.log("Title:", title);
    console.log("Content:", text);
    console.log("token",token)
    try {
        const response = await axios.post('http://localhost:8080/api/letters/upload', { title, content: text }, {
            headers: {
              Authorization:`Bearer ${token}`
          }
      });
      console.log("Response from server:", response.data);
      alert("Letter sent successfully!");
    } catch (error) {
      console.error("Error sending data:", error);
      alert("Failed to send letter.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4 ">
      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div>
        <h2 className="text-lg font-semibold mb-2">Editor</h2>
        <Editor
          value={text}
          onTextChange={handleTextChange}
          style={{ height: '320px' }}
        />
      </div>

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Send
      </button>
    </div>
  );
};

export default LetterEditor;
