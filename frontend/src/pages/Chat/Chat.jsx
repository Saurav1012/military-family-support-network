import { useEffect, useState, useContext } from "react";
import API from "../../services/chatService";
import socket from "../../services/socket";
import { AuthContext } from "../../context/AuthContext";

import ConversationList from "../../components/Chat/ConversationList";
import ChatWindow from "../../components/Chat/ChatWindow";
import MessageInput from "../../components/Chat/MessageInput";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  // Real-time message, delete & typing listeners
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    const handleUserTyping = () => setTyping(true);
    const handleStopTyping = () => setTyping(false);

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-deleted", handleMessageDeleted);
    socket.on("user-typing", handleUserTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-deleted", handleMessageDeleted);
      socket.off("user-typing", handleUserTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, []);

  const loadConversations = async () => {
    try {
      const res = await API.get("/chat/conversation");
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const openConversation = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      setTyping(false);
      
      if (socket && conversation?._id) {
        socket.emit("join-room", conversation._id);
      }

      const res = await API.get(`/chat/${conversation._id}`);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Error opening conversation:", error);
    }
  };

  // 🟢 Updated to support both Text & File Attachments
  const sendMessage = async ({ text, file }) => {
    if (!selectedConversation) return;

    try {
      const formData = new FormData();
      if (text) formData.append("message", text);
      if (file) formData.append("file", file);

      const res = await API.post(
        `/chat/${selectedConversation._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newMessage = res.data.data || res.data;
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // 🟢 Message Delete Functionality
  const deleteMessage = async (messageId) => {
    try {
      await API.delete(`/chat/message/${messageId}`);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    /* 🟢 Outer Page Scrollbar Fixed using Screen Height & overflow hidden */
    <div
      className="container-fluid py-2 px-3"
      style={{ height: "calc(100vh - 70px)", overflow: "hidden" }}
    >
      <div className="row h-100 g-2">
        {/* Left Side: Conversations */}
        <div className="col-md-4 col-lg-3 h-100">
          <div className="card h-100 border-0 shadow-sm d-flex flex-column">
            <div className="card-header bg-dark text-white fw-bold py-3">
              💬 Support Messages
            </div>
            <div className="card-body p-0 flex-grow-1 overflow-auto">
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversation?._id}
                onSelect={openConversation}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Chat Window + Message Input */}
        <div className="col-md-8 col-lg-9 h-100">
          <div className="card h-100 border-0 shadow-sm d-flex flex-column">
            {selectedConversation ? (
              <>
                <ChatWindow
                  messages={messages}
                  currentUser={user}
                  typing={typing}
                  onDeleteMessage={deleteMessage}
                />
                <MessageInput onSend={sendMessage} />
              </>
            ) : (
              <div className="card-body d-flex flex-column align-items-center justify-content-center text-muted bg-light">
                <div className="display-4 mb-2">💬</div>
                <h5 className="fw-bold">No Conversation Selected</h5>
                <p className="small mb-0">Select a user or admin to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;