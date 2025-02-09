 
"use client";

import url from "@/redux/api/baseUrl";
import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
import { useGetMessageQuery } from "@/redux/fetures/messaging/getMessage";
import { useSendMessageMutation } from "@/redux/fetures/messaging/sendMessage";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import React, { useEffect, useState, useRef } from "react";

const MessagesPage = () => {
  const { data: chatList } = useGetChatlistQuery();
  const { data: user } = useLogedUserQuery();

  const [sendMessage, { isLoading }] = useSendMessageMutation();

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

  // Ref for the chat messages container
  const messagesEndRef = useRef(null);

  // Update active user when users are fetched or when the active chat changes
  useEffect(() => {
    if (activeChatId) {
      setMessages(messagesData?.data?.attributes || []);
    }
  }, [activeChatId, messagesData]);

  // Scroll to the last message when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a new message
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    const data = {
      receiver: activeUser.id,
      text: newMessage,
    };
    if (newMessage.trim() && activeUser?.id) {
      // Call the sendMessage mutation
      sendMessage(data)
        .unwrap()
        .then(() => {
          // Optionally, update the local messages state
          setMessages([
            ...messages,
            { id: Date.now(), text: newMessage, sender: "me", time: "Now" },
          ]);
          setNewMessage(""); // Clear the input field
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
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
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-200 ${
                    activeUser?.id === user.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => {
                    setActiveUser(user);
                    setActiveChatId(user?.chatId); // Set active chat
                  }}
                >
                  <img
                    src={user?.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No chat lists available</p>
            )}
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
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9fafb]"
            style={{ maxHeight: "calc(100vh - 150px)", minHeight: "200px" }}
          >
            {messages.length > 0 ? (
              messages.map((msg) => (
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
                    <p className="text-xs text-gray-300 mt-1">
                      {new Date(msg?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No messages available</p>
            )}
            <div ref={messagesEndRef} />
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





// "use client" 

// import React, { useEffect, useState, useRef } from "react";
// import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
// import { useGetMessageQuery } from "@/redux/fetures/messaging/getMessage";
// import { useSendMessageMutation } from "@/redux/fetures/messaging/sendMessage";
// import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
// import url from "@/redux/api/baseUrl";
// import io from "socket.io-client";

// const MessagesPage = () => {
//   const { data: chatList } = useGetChatlistQuery();
//   const { data: user } = useLogedUserQuery();
//   const [sendMessage, { isLoading }] = useSendMessageMutation();
//   const messagesEndRef = useRef(null);
//   const socketRef = useRef(null);

//   const [activeChatId, setActiveChatId] = useState(null);
//   const { data: messagesData } = useGetMessageQuery(activeChatId);

//   const chatData = chatList?.data?.attributes || [];
//   const userId = user?.data?.attributes?.user?.id;

//   const users = chatData.map((chat) => {
//     const participant = chat.participants.find((p) => p.id !== userId);
//     return {
//       id: participant?.id,
//       name: participant?.fullName,
//       status: participant?.role,
//       avatar: participant?.image?.url ? `${url}${participant.image.url}` : '/default-avatar.png',
//       chatId: chat.id,
//     };
//   });

//   const [activeUser, setActiveUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [onlineUsers, setOnlineUsers] = useState(new Set());

//   // Initialize socket connection
//   useEffect(() => {
//     if (userId) {
//       socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
//         query: { userId },
//       });

//       // Socket event listeners
//       socketRef.current.on("connect", () => {
//         console.log("Connected to socket server");
//       });

//       socketRef.current.on("userOnline", (onlineUserIds) => {
//         setOnlineUsers(new Set(onlineUserIds));
//       });

//       socketRef.current.on("userOffline", (offlineUserId) => {
//         setOnlineUsers((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(offlineUserId);
//           return newSet;
//         });
//       });

//       socketRef.current.on("newMessage", (message) => {
//         if (message.chatId === activeChatId) {
//           setMessages((prev) => [...prev, message]);
//           scrollToBottom();
//         }
//       });

//       // Cleanup on unmount
//       return () => {
//         if (socketRef.current) {
//           socketRef.current.disconnect();
//         }
//       };
//     }
//   }, [userId, activeChatId]);

//   // Set initial active user if none selected
//   useEffect(() => {
//     if (!activeUser && users.length > 0) {
//       setActiveUser(users[0]);
//       setActiveChatId(users[0]?.chatId);
//     }
//   }, [users]);

//   // Update messages when active chat changes
//   useEffect(() => {
//     if (messagesData?.data?.attributes) {
//       setMessages(messagesData.data.attributes);
//       scrollToBottom();
//     }
//   }, [messagesData]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     const trimmedMessage = newMessage.trim();
//     if (!trimmedMessage || !activeUser?.id || isLoading) return;

//     try {
//       const data = {
//         receiver: activeUser.id,
//         text: trimmedMessage,
//         chatId: activeChatId,
//       };

//       // Send message through API
//       const response = await sendMessage(data).unwrap();
      
//       // Emit socket event
//       if (socketRef.current) {
//         socketRef.current.emit("sendMessage", {
//           ...response.data,
//           chatId: activeChatId,
//           receiver: activeUser.id,
//         });
//       }

//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const handleUserSelect = (user) => {
//     setActiveUser(user);
//     setActiveChatId(user?.chatId);
    
//     // Join chat room
//     if (socketRef.current) {
//       socketRef.current.emit("joinChat", user.chatId);
//     }
//   };

//   // Type indicator functionality
//   const [isTyping, setIsTyping] = useState(false);
//   const typingTimeoutRef = useRef(null);

//   const handleTyping = () => {
//     if (socketRef.current && activeUser) {
//       socketRef.current.emit("typing", {
//         chatId: activeChatId,
//         userId: userId,
//       });

//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }

//       typingTimeoutRef.current = setTimeout(() => {
//         socketRef.current.emit("stopTyping", {
//           chatId: activeChatId,
//           userId: userId,
//         });
//       }, 1000);
//     }
//   };

//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on("userTyping", (data) => {
//         if (data.chatId === activeChatId && data.userId !== userId) {
//           setIsTyping(true);
//           if (typingTimeoutRef.current) {
//             clearTimeout(typingTimeoutRef.current);
//           }
//           typingTimeoutRef.current = setTimeout(() => {
//             setIsTyping(false);
//           }, 1500);
//         }
//       });

//       socketRef.current.on("userStoppedTyping", (data) => {
//         if (data.chatId === activeChatId && data.userId !== userId) {
//           setIsTyping(false);
//         }
//       });
//     }
//   }, [activeChatId, userId]);

//   return (
//     <div className="container mx-auto mt-12">
//       <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Messages</h1>

//       <div className="flex bg-white shadow-lg rounded-lg overflow-hidden h-[calc(100vh-200px)]">
//         {/* Left Sidebar */}
//         <div className="w-1/4 border-r bg-gray-50 overflow-y-auto">
//           <div className="p-4">
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <div
//                   key={user.id}
//                   className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors ${
//                     activeUser?.id === user.id ? "bg-gray-200" : ""
//                   }`}
//                   onClick={() => handleUserSelect(user)}
//                 >
//                   <div className="relative">
//                     <img
//                       src={user.avatar}
//                       alt={user.name}
//                       className="w-12 h-12 rounded-full object-cover"
//                       onError={(e) => {
//                         e.target.src = '/default-avatar.png';
//                       }}
//                     />
//                     {onlineUsers.has(user.id) && (
//                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-800">{user.name}</h4>
//                     <p className="text-sm text-gray-500">
//                       {onlineUsers.has(user.id) ? "Online" : "Offline"}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No chat lists available</p>
//             )}
//           </div>
//         </div>

//         {/* Right Chat Section */}
//         <div className="w-3/4 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 border-b bg-gray-50">
//             {activeUser ? (
//               <>
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   {activeUser.name}
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   {onlineUsers.has(activeUser.id) ? "Online" : "Offline"}
//                   {isTyping && " • Typing..."}
//                 </p>
//               </>
//             ) : (
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Select a chat to start messaging
//               </h2>
//             )}
//           </div>

//           {/* Chat Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9fafb]">
//             {messages.length > 0 ? (
//               messages.map((msg) => (
//                 <div
//                   key={msg._id}
//                   className={`flex ${
//                     msg.sender?.id === userId ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`px-4 py-2 rounded-lg max-w-[70%] break-words ${
//                       msg.sender?.id === userId
//                         ? "bg-blue-600 text-white"
//                         : "bg-green-500 text-white"
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap">{msg.text}</p>
//                     <p className="text-xs text-gray-300 mt-1">
//                       {new Date(msg.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No messages yet</p>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="p-4 border-t bg-gray-50">
//             <div className="flex items-center gap-4">
//               <input
//                 type="text"
//                 className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder={activeUser ? "Type your message" : "Select a chat to start messaging"}
//                 value={newMessage}
//                 onChange={(e) => {
//                   setNewMessage(e.target.value);
//                   handleTyping();
//                 }}
//                 onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
//                 disabled={!activeUser}
//               />
//               <button
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleSendMessage}
//                 disabled={!activeUser || !newMessage.trim() || isLoading}
//               >
//                 {isLoading ? "Sending..." : "Send"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessagesPage;