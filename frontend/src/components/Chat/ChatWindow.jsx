const ChatWindow = ({ messages }) => {
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const currentUserId = currentUser.id || currentUser._id;

  return (
    <div
      style={{
        height: "500px",
        overflowY: "auto",
      }}
      className="border rounded p-3"
    >
      {messages.map((msg) => {
        const isSentByMe = (msg.sender?._id || msg.sender) === currentUserId;

        return (
          <div
            key={msg._id || Math.random()}
            className={isSentByMe ? "text-end mb-3" : "text-start mb-3"}
          >
            <div
              className={
                isSentByMe
                  ? "bg-primary text-white p-2 rounded d-inline-block"
                  : "bg-light text-dark p-2 rounded d-inline-block"
              }
            >
              {msg.message}
            </div>

            {/* Message Status (Seen / Delivered / Sent) for Sender */}
            {isSentByMe && (
              <div className="mt-1">
                {msg.seen ? (
                  <small className="text-primary fw-semibold">Seen</small>
                ) : msg.delivered ? (
                  <small className="text-muted">Delivered</small>
                ) : (
                  <small className="text-muted">Sent</small>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatWindow;