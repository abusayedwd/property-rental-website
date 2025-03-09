 

 "use client";

import url from "@/redux/api/baseUrl";
import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
import { useGetMessageQuery } from "@/redux/fetures/messaging/getMessage";
import { useSendMessageMutation } from "@/redux/fetures/messaging/sendMessage";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import React, { useEffect, useState, useRef } from "react";
import { Menu } from "lucide-react";
import { useSearchParams } from "next/navigation";

const MessagesPage = () => {
  const { data: chatList } = useGetChatlistQuery();
  const { data: user } = useLogedUserQuery();
  const [showSidebar, setShowSidebar] = useState(true);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const searchParams = useSearchParams();
  const chatIdFromQuery = searchParams.get("chatId");

  const [activeChatId, setActiveChatId] = useState(chatIdFromQuery || null);
  const { data: messagesData } = useGetMessageQuery(activeChatId);

  const chatData = chatList?.data?.attributes || [];
  const userId = user?.data?.attributes?.user?.id;

  const users = chatData.map((chat) => {
    const participant = chat.participants.find((p) => p.id !== userId);
    return {
      id: participant?.id,
      name: participant?.fullName,
      status: participant?.role,
      avatar: url + participant?.image?.url,
      chatId: chat.id,
    };
  });

  const [activeUser, setActiveUser] = useState(users.find(user => user.chatId === activeChatId) || users[0] || null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (activeChatId) {
      setMessages(messagesData?.data?.attributes || []);
    }
  }, [activeChatId, messagesData]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    const data = {
      receiver: activeUser.id,
      text: newMessage,
    };
    if (newMessage.trim() && activeUser?.id) {
      sendMessage(data)
        .unwrap()
        .then(() => {
          setMessages([
            ...messages,
            { id: Date.now(), text: newMessage, sender: { id: userId }, time: "Now" },
          ]);
          setNewMessage("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  const handleUserSelect = (user) => {
    setActiveUser(user);
    setActiveChatId(user?.chatId);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="container mx-auto mt-4 md:mt-12 pb-20 px-2 md:px-4">
      <h1 className="text-center text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-8">Messages</h1>

      {/* Main Container */}
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden h-[100vh]">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden absolute mt-20 top-4 left-4 p-2 bg-green-600 text-white rounded-lg"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <Menu size={24} />
        </button>

        {/* Left Sidebar */}
        <div className={`${showSidebar ? 'block' : 'hidden'} w-full md:w-1/4 border-r bg-gray-50 md:block ${showSidebar && 'absolute md:relative inset-0 z-10 bg-white md:bg-gray-50'}`}>
          <h1 className="text-2xl text-green-600 ml-5 mt-4">Chat List</h1>
          <div className="p-4 overflow-y-auto h-full">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-200 ${activeUser?.id === user.id ? "bg-gray-200" : ""}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <img
                    src={user?.avatar}
                    alt={user.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
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
        <div className={`${!showSidebar ? 'block' : 'hidden'} w-full md:w-3/4 mt-8 flex flex-col md:block`}>
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
            style={{ height: "calc(100% - 140px)" }}
          >
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.sender?.id === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${msg.sender?.id === userId ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender?.id === userId ? "text-gray-200" : "text-gray-500"}`}>
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
          <div className="p-3 md:p-4 border-t bg-gray-50 flex items-center gap-2 md:gap-4">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base"
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 text-sm md:text-base whitespace-nowrap"
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

// "use client";

// import url from "@/redux/api/baseUrl";
// import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
// import { useGetMessageQuery } from "@/redux/fetures/messaging/getMessage";
// import { useSendMessageMutation } from "@/redux/fetures/messaging/sendMessage";
// import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
// import React, { useEffect, useState, useRef } from "react";
// import { Menu } from "lucide-react";
// import { useSearchParams } from "next/navigation";
// import socket from "@/utils/socket";

// const MessagesPage = () => {
//   // Queries and Mutations
//   const { data: chatList } = useGetChatlistQuery();
//   const { data: user } = useLogedUserQuery();
//   const [sendMessage, { isLoading }] = useSendMessageMutation();
//   const searchParams = useSearchParams();
//   const chatIdFromQuery = searchParams.get("chatId");

//   // State Management
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [activeChatId, setActiveChatId] = useState(chatIdFromQuery || null);
//   const [newMessage, setNewMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const messagesEndRef = useRef(null);

//   // Fetch messages for active chat
//   const { data: messagesData } = useGetMessageQuery(activeChatId);

//   // Process chat data
//   const chatData = chatList?.data?.attributes || [];
//   const userId = user?.data?.attributes?.user?.id;

//   // Process users data
//   const users = chatData.map((chat) => {
//     const participant = chat.participants.find((p) => p.id !== userId);
//     return {
//       id: participant?.id,
//       name: participant?.fullName,
//       status: participant?.role,
//       avatar: url + participant?.image?.url,
//       chatId: chat.id,
//     };
//   });

//   const [activeUser, setActiveUser] = useState(
//     users.find((user) => user.chatId === activeChatId) || users[0] || null
//   );

//   // ✅ **Connect to Socket & Handle Realtime Messages**
//   useEffect(() => {
//     if (!userId) return;

//     // 🔹 Ensure the socket is connected
//     if (!socket.connected) {
//       socket.connect();
//     }

//     // 🔹 Register user with socket
//     socket.emit("user_connected", userId);

//     // 🔹 Handle incoming messages
//     socket.on("receive_message", (newMessage) => {
//       console.log("New Message Received:", newMessage);
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     // 🔹 Handle connection status
//     socket.on("connect", () => {
//       console.log("Socket connected successfully");
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected, attempting to reconnect...");
//       setTimeout(() => {
//         socket.connect();
//       }, 2000);
//     });

//     // Cleanup listeners on unmount
//     return () => {
//       socket.off("receive_message");
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.disconnect();
//     };
//   }, [userId]);

//   // **Join Chat Room & Fetch Messages**
//   useEffect(() => {
//     if (activeChatId) {
//       console.log(`Joining chat room: ${activeChatId}`);
//       socket.emit("join_chat", activeChatId);
//       setMessages(messagesData?.data?.attributes || []);
//     }
//   }, [activeChatId, messagesData]);

//   //  **Auto-scroll to latest message**
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   // ✅ **Handle sending messages**
//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !activeUser?.id || !activeChatId) return;

//     const messageData = {
//       text: newMessage,
//       sender: { id: userId },
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       // 🔹 Send message to the backend
//       await sendMessage({
//         receiver: activeUser.id,
//         text: newMessage,
//       }).unwrap();

//       // 🔹 Emit message via socket
//       socket.emit("send_message", {
//         chatId: activeChatId,
//         message: messageData,
//       });

//       // 🔹 Update local state instantly
//       setMessages((prev) => [...prev, messageData]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   // ✅ **Handle user selection**
//   const handleUserSelect = (user) => {
//     setActiveUser(user);
//     setActiveChatId(user?.chatId);
//     if (window.innerWidth < 768) {
//       setShowSidebar(false);
//     }
//   };

//   return (
//     <div className="container mx-auto mt-4 md:mt-12 pb-20 px-2 md:px-4">
//       <h1 className="text-center text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-8">
//         Messages
//       </h1>

//       {/* Main Container */}
//       <div className="flex bg-white shadow-lg rounded-lg overflow-hidden h-[80vh]">
//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden absolute mt-20 top-4 left-4 p-2 bg-green-600 text-white rounded-lg"
//           onClick={() => setShowSidebar(!showSidebar)}
//         >
//           <Menu size={24} />
//         </button>

//         {/* Left Sidebar */}
//         <div
//           className={`${
//             showSidebar ? "block" : "hidden"
//           } w-full md:w-1/4 border-r bg-gray-50 md:block`}
//         >
//           <div className="p-4 overflow-y-auto h-full">
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <div
//                   key={user.id}
//                   className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-200 ${
//                     activeUser?.id === user.id ? "bg-gray-200" : ""
//                   }`}
//                   onClick={() => handleUserSelect(user)}
//                 >
//                   <img
//                     src={user?.avatar}
//                     alt={user.name}
//                     className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <h4 className="font-semibold text-gray-800">{user.name}</h4>
//                     <p className="text-sm text-gray-500">{user.status}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No chat lists available</p>
//             )}
//           </div>
//         </div>

//         {/* Chat Section */}
//         <div className="w-full md:w-3/4 flex flex-col">
//           {/* Chat Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9fafb]">
//             {messages.length > 0 ? (
//               messages.map((msg) => (
//                 <div key={msg.createdAt} className={`flex ${msg.sender?.id === userId ? "justify-end" : "justify-start"}`}>
//                   <div className={`px-4 py-2 rounded-lg max-w-[80%] ${msg.sender?.id === userId ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}>
//                     <p>{msg.text}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No messages available</p>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="p-3 border-t bg-gray-50 flex items-center">
//             <input type="text" className="flex-1 border rounded-lg px-3" placeholder="Type your message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
//             <button className="bg-green-600 text-white px-4 py-2 rounded-lg" onClick={handleSendMessage}>Send</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessagesPage;