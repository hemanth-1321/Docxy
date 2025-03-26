import React, { useEffect, useState } from "react";
import { File, Trash2 } from "lucide-react";
import axios from "axios";
import LetterEditor from "../components/LetterEditor";
import { BACKEND_URL } from "@/lib/Api";

interface Letter {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const LetterPage: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/letters/user-files`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setLetters(response.data.files);
      if (response.data.files.length > 0 && !selectedLetter) {
        setSelectedLetter(response.data.files[0]);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const deleteLetter = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/letters/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      fetchLetters();
      if (selectedLetter?.id === id) setSelectedLetter(null);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="min-h-screen pt-4 px-10 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Scrollable User Files List */}
          <div className="md:col-span-4 lg:col-span-3 bg-white rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-8rem)] shadow-md">
            <h2 className="text-xl font-bold mb-4">User Files</h2>
            <button
              onClick={() => setSelectedLetter(null)}
              className="w-full p-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              + Create New Letter
            </button>
            <div className="space-y-2 mt-4">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    selectedLetter?.id === letter.id ? "bg-gray-200" : ""
                  }`}
                >
                  <div onClick={() => setSelectedLetter(letter)} className="flex items-center w-full">
                    <File className="h-5 w-5 mr-2 text-gray-500" />
                    <div className="flex-grow">
                      <p className="font-medium truncate w-40 sm:w-56 md:w-64">{letter.title}</p>
                      <p className="text-sm text-gray-500">{new Date(letter.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteLetter(letter.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Letter Editor Component */}
          <div className="md:col-span-8 lg:col-span-9">
            <LetterEditor selectedLetter={selectedLetter} refreshLetters={fetchLetters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterPage;
