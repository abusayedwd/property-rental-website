"use client";

import React, { useState } from "react";

const MessagesPage = () => {
  // Sample user data
  const users = [
    { id: 1, name: "Cameron Williamson", status: "E45AU", avatar: "/images/user1.jpg" },
    { id: 2, name: "Darrell Steward", status: "E45AU", avatar: "/images/user2.jpg" },
    { id: 3, name: "Brooklyn Simmons", status: "E45AU", avatar: "/images/user3.jpg" },
    { id: 4, name: "Kristin Watson", status: "E45AU", avatar: "/images/user4.jpg" },
    { id: 5, name: "Devon Lane", status: "E45AU", avatar: "/images/user5.jpg" },
    { id: 6, name: "Esther Howard", status: "E45AU", avatar: "/images/user6.jpg" },
    { id: 7, name: "Julie Jones", status: "E45AU", avatar: "/images/user7.jpg" },
    { id: 8, name: "Ronald Richards", status: "E45AU", avatar: "/images/user8.jpg" },
    { id: 9, name: "Robert Fox", status: "E45AU", avatar: "/images/user9.jpg" },
    { id: 10, name: "Ahmad Kabir", status: "E45AU", avatar: "/images/user10.jpg" },
  ];

  // Sample chat data
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, I'm looking to get my backyard pool cleaned. Do you offer that service?", sender: "other", time: "Yesterday, 3:00 PM" },
    { id: 2, text: "Yes, we do! When would you like to schedule it?", sender: "me", time: "Yesterday, 3:05 PM" },
    { id: 3, text: "I’d like to do it next Friday.", sender: "other", time: "Yesterday, 3:10 PM" },
  ]);

  // Active user state
  const [activeUser, setActiveUser] = useState(users[0]);

  // New message state
  const [newMessage, setNewMessage] = useState("");

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me", time: "Now" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto mt-12">
      <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Messages</h1>

      {/* Main Container */}
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-1/4 border-r bg-gray-50">
          <div className="p-4">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-200 ${
                  activeUser.id === user.id ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveUser(user)}
              >
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold text-gray-800">{user.name}</h4>
                  <p className="text-sm text-gray-500">{user.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Section */}
        <div className="w-3/4 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">{activeUser.name}</h2>
            <p className="text-sm text-gray-500">Active 2 hours ago</p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg ${
                    msg.sender === "me" ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-300 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-gray-50 flex items-center gap-4">
            <input
              type="text"
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
