import React, { useEffect, useRef } from "react";

const ChatWindow = ({setSidebarOpen, messages, user, sendMessage, input, setInput }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div onClick={()=> setSidebarOpen(false)} className="backdrop-blur-sm flex flex-col flex-1 md:pl-8 relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex justify-between p-2 rounded max-w-xs  ${ msg.senderId === user._id
                ? "bg-blue-400 text-white ml-auto"
                : "bg-gray-300 text-black"
              }`}
          >
            <p>{msg.text}</p>
            <small>
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2">
        <input
          type="text"
          className="flex-1 text-white placeholder:text-gray-400 border border-gray-600 rounded px-3 py-2 bg-black/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;