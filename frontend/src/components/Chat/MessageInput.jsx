import { useState, useRef } from "react";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    onSend({ text, file });
    setText("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form className="card-footer bg-white border-top p-2" onSubmit={handleSubmit}>
      {file && (
        <div className="d-flex align-items-center justify-content-between bg-light p-1 px-2 mb-2 rounded border small">
          <span className="text-truncate">📎 {file.name}</span>
          <button type="button" className="btn-close btn-sm" onClick={() => setFile(null)}></button>
        </div>
      )}

      <div className="input-group">
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          <FaPaperclip />
        </button>

        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button type="submit" className="btn btn-success px-4">
          <FaPaperPlane />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;