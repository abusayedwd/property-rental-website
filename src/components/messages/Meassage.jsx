 

// "use client";

// import url from "@/redux/api/baseUrl";
// import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
// import { useGetMessageQuery } from "@/redux/fetures/messaging/getMessage";
// import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
// import React, { useEffect, useState } from "react";

// const MessagesPage = () => {
//   const { data: chatList } = useGetChatlistQuery();

//   const {data: messagess} = useGetMessageQuery(chatId)

//   const chatData = chatList?.data?.attributes || [];
//   const {data: user} = useLogedUserQuery()
//   console.log(user?.data?.attributes?.user.id)
//   const userId = user?.data?.attributes?.user?.id
//   // Logged-in user (Testing User)
//   // const loggedInUserId = "67a0eb49c96785f2c7790974"; // Replace this dynamically when login is implemented

//   // Extract chat participants excluding the logged-in user
//   const users = chatData.map((chat) => {
//     const participant = chat.participants.find((p) => p.id !== userId);
//     return {
//       id: participant?.id,
//       name: participant?.fullName,
//       status: participant?.role,
//       avatar: url + participant?.image?.url,
//     };
//   });

//   // State for active chat
//   const [activeUser, setActiveUser] = useState(users[0] || null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Update active user when users are fetched
//   useEffect(() => {
//     if (users.length > 0) {
//       setActiveUser(users[0]);
//     }
//   }, [chatList]);

//   // Handle sending a new message
//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me", time: "Now" }]);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="container mx-auto mt-12">
//       <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Messages</h1>

//       {/* Main Container */}
//       <div className="flex bg-white shadow-lg rounded-lg overflow-hidden">
//         {/* Left Sidebar */}
//         <div className="w-1/4 border-r bg-gray-50">
//           <div className="p-4">
//             {users.map((user) => (
//               <div
//                 key={user.id}
//                 className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-200 ${
//                   activeUser?.id === user.id ? "bg-gray-200" : ""
//                 }`}
//                 onClick={() => setActiveUser(user)}
//               >
//                 <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
//                 <div>
//                   <h4 className="font-semibold text-gray-800">{user.name}</h4>
//                   <p className="text-sm text-gray-500">{user.status}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Chat Section */}
//         <div className="w-3/4 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 border-b bg-gray-50">
//             <h2 className="text-lg font-semibold text-gray-800">{activeUser?.name || "Select a chat"}</h2>
//             <p className="text-sm text-gray-500">Active 2 hours ago</p>
//           </div>

//           {/* Chat Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
//             {messages.map((msg) => (
//               <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
//                 <div
//                   className={`px-4 py-2 rounded-lg ${
//                     msg.sender === "me" ? "bg-blue-600 text-white" : "bg-green-500 text-white"
//                   }`}
//                 >
//                   <p>{msg.text}</p>
//                   <p className="text-xs text-gray-300 mt-1">{msg.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Message Input */}
//           <div className="p-4 border-t bg-gray-50 flex items-center gap-4">
//             <input
//               type="text"
//               className="flex-1 border rounded-lg px-4 py-2"
//               placeholder="Type your message"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//             />
//             <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500" onClick={handleSendMessage}>
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessagesPage;


"use client";

import url from "@/redux/api/baseUrl";
import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
import { useGetMessageQuery } from "@/redux/fetures/messaging/getMessage";
import { useSendMessageMutation } from "@/redux/fetures/messaging/sendMessage";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import React, { useEffect, useState } from "react";

const MessagesPage = () => {
  const { data: chatList } = useGetChatlistQuery();
  const { data: user } = useLogedUserQuery();

  const [sendMessage, {isLoading}] = useSendMessageMutation()

  // Fetch the messages when a chat is selected
  const [activeChatId, setActiveChatId] = useState(null);
  const { data: messagesData } = useGetMessageQuery(activeChatId);

  const chatData = chatList?.data?.attributes || [];
  const userId = user?.data?.attributes?.user?.id;

  // Extract chat participants excluding the logged-in user
  const users = chatData.map((chat) => {
    const participant = chat.participants.find((p) => p.id !== userId);
    return {
      id: participant?.id,
      name: participant?.fullName,
      status: participant?.role,
      avatar: url + participant?.image?.url,
      chatId: chat.id, // Store chatId for fetching messages
    };
  });

  // State for active user and messages
  const [activeUser, setActiveUser] = useState(users[0] || null);
  const [messages, setMessages] = useState([]);
  console.log(messages)

  // Update active user when users are fetched or when the active chat changes
  useEffect(() => {
    if (activeChatId) {
      setMessages(messagesData?.data?.attributes || []);
    }
  }, [activeChatId, messagesData]);

  // Handle sending a new message
  const [newMessage, setNewMessage] = useState("");
  

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), text: newMessage, sender: "me", time: "Now" },
      ]);
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
                  activeUser?.id === user.id ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setActiveUser(user);
                  setActiveChatId(user.chatId); // Set active chat
                }}
              >
                <img
                  src={user?.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{user.name}d</h4>
                  <p className="text-sm text-gray-500">{user.status}dd</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Section */}
        <div className="w-3/4 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeUser?.name || "Select a chat"}
            </h2>
            <p className="text-sm text-gray-500">Active 2 hours ago</p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender?.id === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg ${
                    msg.sender?.id === userId
                      ? "bg-blue-600 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-300 mt-1">{msg.createdAt}</p>
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
