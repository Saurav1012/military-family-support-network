import { useState, useContext } from "react";
import socket from "../../services/socket";
import { AuthContext } from "../../context/AuthContext";

const MessageInput = ({ onSend, receiverId, typing }) => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const userId = user?._id || user?.id;

  const handleChange = (e) => {
    setMessage(e.target.value);

    // Emit typing event to backend/receiver
    if (receiverId) {
      socket.emit("typing", {
        senderId: userId,
        receiverId,
      });
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    onSend(message);

    // Stop typing event emit on send
    if (receiverId) {
      socket.emit("stop-typing", {
        senderId: userId,
        receiverId,
      });
    }

    setMessage("");
  };

  return (
    <div className="mt-3">
      {/* Step 8: Show Typing Status above input */}
      {typing && (
        <div className="mb-1 ms-1">
          <small className="text-success fw-semibold">Typing...</small>
        </div>
      )}

      {/* Step 7: Input with Socket Typing Emitter */}
      <form onSubmit={handleSend} className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type message..."
          value={message}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;