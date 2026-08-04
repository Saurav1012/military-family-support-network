import { useEffect, useRef } from "react";
import { FaTrash, FaFileAlt } from "react-icons/fa";

const ChatWindow = ({ messages, currentUser, typing, onDeleteMessage }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div
      className="card-body p-3 flex-grow-1 overflow-auto bg-light"
      style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "16px 16px" }}
    >
      {messages.map((msg) => {
        const isMe = msg.sender === currentUser?._id || msg.sender?._id === currentUser?._id;

        return (
          <div key={msg._id} className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
            <div
              className={`p-2 px-3 rounded-3 shadow-sm ${isMe ? "bg-success text-white" : "bg-white text-dark"}`}
              style={{ maxWidth: "70%" }}
            >
              {/* Media File / Document Display */}
              {msg.fileUrl && (
                <div className="mb-2">
                  {msg.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <img src={msg.fileUrl} alt="attachment" className="img-fluid rounded border mb-1" style={{ maxHeight: "200px" }} />
                  ) : (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className={`d-flex align-items-center gap-2 p-2 rounded text-decoration-none ${isMe ? "bg-white text-dark" : "bg-light text-primary"}`}>
                      <FaFileAlt />
                      <span className="small text-truncate" style={{ maxWidth: "150px" }}>{msg.fileName || "View Document"}</span>
                    </a>
                  )}
                </div>
              )}

              {msg.message && <p className="mb-1 small">{msg.message}</p>}

              <div className="d-flex align-items-center justify-content-end gap-2 mt-1 opacity-75" style={{ fontSize: "10px" }}>
                <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                {isMe && (
                  <button className="btn btn-link p-0 text-white border-0 ms-1" title="Delete" onClick={() => onDeleteMessage(msg._id)}>
                    <FaTrash size={10} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {typing && <div className="text-muted small fst-italic mb-2 ps-2">typing...</div>}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;