import React from "react";

const ConversationList = ({ conversations, onSelect }) => {
  return (
    <div className="list-group">

      {conversations.map((conversation) => {

        const otherUser = conversation.participants.find(
          (user) =>
            user._id !== JSON.parse(localStorage.getItem("user")).id
        );

        return (
          <button
            key={conversation._id}
            className="list-group-item list-group-item-action"
            onClick={() => onSelect(conversation)}
          >
            <h6>{otherUser?.name}</h6>

            <small>{conversation.lastMessage}</small>
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;