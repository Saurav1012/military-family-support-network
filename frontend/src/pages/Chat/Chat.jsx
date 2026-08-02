import { useEffect, useState } from "react";

import API from "../../services/chatService";
import socket from "../../services/socket";

import ConversationList from "../../components/Chat/ConversationList";
import ChatWindow from "../../components/Chat/ChatWindow";
import MessageInput from "../../components/Chat/MessageInput";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  // Real-time message & typing status listeners
  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user-typing", () => {
      setTyping(true);
    });

    socket.on("stop-typing", () => {
      setTyping(false);
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-typing");
      socket.off("stop-typing");
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
      setTyping(false); // Reset typing indicator on conversation switch
      const res = await API.get(`/chat/${conversation._id}`);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Error opening conversation:", error);
    }
  };

  const sendMessage = async (text) => {
    if (!selectedConversation) return;

    try {
      const res = await API.post(`/chat/${selectedConversation._id}`, {
        message: text,
      });

      setMessages((prev) => [...prev, res.data.data]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-4">
          <ConversationList
            conversations={conversations}
            onSelect={openConversation}
          />
        </div>

        <div className="col-md-8">
          {selectedConversation ? (
            <>
              {/* Typing Indicator Status Header */}
              {typing && (
                <div className="text-muted fst-italic mb-2 ps-2">
                  <small>typing...</small>
                </div>
              )}
              <ChatWindow messages={messages} />
              <MessageInput onSend={sendMessage} />
            </>
          ) : (
            <h4 className="text-center mt-5">Select a Conversation</h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;