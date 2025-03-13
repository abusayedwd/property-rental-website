 

// "use client";

// import url from "@/redux/api/baseUrl";
// import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
// import { useGetMessageQuery } from "@/redux/fetures/messaging/getMessage";
// import { useSendMessageMutation } from "@/redux/fetures/messaging/sendMessage";
// import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
// import React, { useEffect, useState, useRef } from "react";
// import { Menu } from "lucide-react";
// import { useSearchParams } from "next/navigation";
// import io from "socket.io-client";

// const MessagesPage = () => {
//   const { data: chatList } = useGetChatlistQuery();
//   const { data: user } = useLogedUserQuery();
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [sendMessage, { isLoading }] = useSendMessageMutation();
//   const searchParams = useSearchParams();
//   const chatIdFromQuery = searchParams.get("chatId");

//   const [activeChatId, setActiveChatId] = useState(chatIdFromQuery || null);
//   const { data: messagesData } = useGetMessageQuery(activeChatId);

//   const chatData = chatList?.data?.attributes || [];
//   const userId = user?.data?.attributes?.user?.id;

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

//   const [activeUser, setActiveUser] = useState(users.find(user => user.chatId === activeChatId) || users[0] || null);
//   const [messages, setMessages] = useState([]);
//   const messagesEndRef = useRef(null);
//   const [newMessage, setNewMessage] = useState("");
//   const socketRef = useRef(null);
//   const [unreadMessages, setUnreadMessages] = useState({});
  
//   // Connect to socket.io server
//   useEffect(() => {
//     // Connect to the socket server
//     socketRef.current = io(url);
    
//     // Listen for incoming messages
//     socketRef.current.on("connect", () => {
//       console.log("Connected to socket server");
//     });
    
//     // Clean up on component unmount
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, []);
  
//   // Join user-specific room when userId is available
//   useEffect(() => {
//     if (userId && socketRef.current) {
//       // Join a room specific to this user
//       socketRef.current.emit("joinRoom", userId);
      
//       // Set up listener for new messages
//       socketRef.current.on("newMessage", (message) => {
//         console.log("New message received:", message);
        
//         // If message is for the active chat, add it to messages
//         if (message.chatId === activeChatId) {
//           setMessages(prevMessages => [...prevMessages, message]);
//         } else {
//           // Otherwise, increment unread count for that chat
//           setUnreadMessages(prev => ({
//             ...prev,
//             [message.chatId]: (prev[message.chatId] || 0) + 1
//           }));
          
//           // Optional: Play notification sound
//           const audio = new Audio('/notification-sound.mp3');
//           audio.play().catch(err => console.log('Audio playback error:', err));
//         }
//       });
//     }
    
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off("newMessage");
//       }
//     };
//   }, [userId, activeChatId]);

//   useEffect(() => {
//     if (activeChatId) {
//       setMessages(messagesData?.data?.attributes || []);
//       // Clear unread count when switching to a chat
//       setUnreadMessages(prev => ({
//         ...prev,
//         [activeChatId]: 0
//       }));
//     }
//   }, [activeChatId, messagesData]);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (newMessage.trim() && activeUser?.id) {
//       const messageData = {
//         receiver: activeUser.id,
//         text: newMessage,
//         chatId: activeChatId
//       };
      
//       // Send message through API
//       sendMessage(messageData)
//         .unwrap()
//         .then((response) => {
//           // Optimistically add message to UI
//           const newMsg = {
//             _id: Date.now().toString(),
//             text: newMessage,
//             sender: { id: userId },
//             createdAt: new Date().toISOString(),
//             chatId: activeChatId
//           };
          
//           setMessages(prevMessages => [...prevMessages, newMsg]);
//           setNewMessage("");
          
//           // Emit message through socket for real-time delivery
//           if (socketRef.current) {
//             socketRef.current.emit("sendMessage", {
//               ...newMsg,
//               receiverId: activeUser.id
//             });
//           }
//         })
//         .catch((error) => {
//           console.error("Error sending message:", error);
//         });
//     }
//   };

//   const handleUserSelect = (user) => {
//     setActiveUser(user);
//     setActiveChatId(user?.chatId);
    
//     // Clear unread count for this chat
//     setUnreadMessages(prev => ({
//       ...prev,
//       [user.chatId]: 0
//     }));
    
//     if (window.innerWidth < 768) {
//       setShowSidebar(false);
//     }
//   };

//   // Format timestamp to readable time
//   const formatTime = (timestamp) => {
//     if (!timestamp) return "Just now";
    
//     const messageDate = new Date(timestamp);
//     const now = new Date();
    
//     // If message is from today, show only time
//     if (messageDate.toDateString() === now.toDateString()) {
//       return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
    
//     // Otherwise show date
//     return messageDate.toLocaleDateString();
//   };

//   return (
//     <div className="container mx-auto mt-4 md:mt-12 pb-20 px-2 md:px-4">
//       <h1 className="text-center text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-8">Messages</h1>

//       {/* Main Container */}
//       <div className="flex bg-white shadow-lg rounded-lg overflow-hidden h-[100vh]">
//         {/* Mobile Menu Button */}
//         <button 
//           className="md:hidden absolute mt-20 top-4 left-4 p-2 bg-green-600 text-white rounded-lg"
//           onClick={() => setShowSidebar(!showSidebar)}
//         >
//           <Menu size={24} />
//         </button>

//         {/* Left Sidebar */}
//         <div className={`${showSidebar ? 'block' : 'hidden'} w-full md:w-1/4 border-r bg-gray-50 md:block ${showSidebar && 'absolute md:relative inset-0 z-10 bg-white md:bg-gray-50'}`}>
//           <h1 className="text-2xl text-green-600 ml-5 mt-4">Chat List</h1>
//           <div className="p-4 overflow-y-auto h-full">
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <div
//                   key={user.id}
//                   className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-200 relative ${activeUser?.id === user.id ? "bg-gray-200" : ""}`}
//                   onClick={() => handleUserSelect(user)}
//                 >
//                   <img
//                     src={user?.avatar}
//                     alt={user.name}
//                     className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-gray-800">{user.name}</h4>
//                     <p className="text-sm text-gray-500">{user.status}</p>
//                   </div>
//                   {unreadMessages[user.chatId] > 0 && (
//                     <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
//                       {unreadMessages[user.chatId]}
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No chat lists available</p>
//             )}
//           </div>
//         </div>

//         {/* Right Chat Section */}
//         <div className={`${!showSidebar ? 'block' : 'hidden'} w-full md:w-3/4 mt-8 flex flex-col md:block`}>
//           {/* Chat Header */}
//           <div className="p-4 border-b bg-gray-50 flex items-center">
//             {!showSidebar && activeUser && (
//               <button 
//                 className="md:hidden mr-3 text-green-600"
//                 onClick={() => setShowSidebar(true)}
//               >
//                 <Menu size={24} />
//               </button>
//             )}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {activeUser?.name || "Select a chat"}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {activeUser?.status || ""}
//               </p>
//             </div>
//           </div>

//           {/* Chat Messages */}
//           <div
//             className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9fafb]"
//             style={{ height: "calc(100% - 140px)" }}
//           >
//             {messages.length > 0 ? (
//               messages.map((msg) => (
//                 <div
//                   key={msg._id}
//                   className={`flex ${msg.sender?.id === userId ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${msg.sender?.id === userId ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}
//                   >
//                     <p>{msg.text}</p>
//                     <p className={`text-xs mt-1 ${msg.sender?.id === userId ? "text-gray-200" : "text-gray-500"}`}>
//                       {formatTime(msg?.createdAt)}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No messages available</p>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="p-3 md:p-4 border-t bg-gray-50 flex items-center gap-2 md:gap-4">
//             <input
//               type="text"
//               className="flex-1 border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base"
//               placeholder="Type your message"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//               disabled={!activeUser}
//             />
//             <button
//               className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 text-sm md:text-base whitespace-nowrap ${(!activeUser || !newMessage.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={handleSendMessage}
//               disabled={!activeUser || !newMessage.trim()}
//             >
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
import React, { useEffect, useState, useRef } from "react";
import { Menu } from "lucide-react";
import { useSearchParams } from "next/navigation";
import io from "socket.io-client";

const MessagesPage = () => {
  const { data: chatList } = useGetChatlistQuery();
  const { data: user } = useLogedUserQuery();
  const [showSidebar, setShowSidebar] = useState(true);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const searchParams = useSearchParams();
  const chatIdFromQuery = searchParams.get("chatId");

  const [activeChatId, setActiveChatId] = useState(chatIdFromQuery || null);
  const { data: messagesData, refetch: refetchMessages } = useGetMessageQuery(activeChatId, {
    skip: !activeChatId,
  });

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
  const socketRef = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const messagesInitializedRef = useRef({});
  
  // Connect to socket.io server
  useEffect(() => {
    // Connect to the socket server
    socketRef.current = io(url);
    
    // Listen for incoming messages
    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
      
      // Notify server about user connection when socket connects
      if (userId) {
        socketRef.current.emit("user_connected", userId);
      }
    });
    
    // Clean up on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);
  
  // Join chat room when active chat changes
  useEffect(() => {
    if (activeChatId && socketRef.current) {
      // Join the chat room
      socketRef.current.emit("join_chat", activeChatId);
      
      // Set up listener for receiving messages
      const handleReceiveMessage = (message) => {
        console.log("Received message:", message);
        
        // Add message to chat if it doesn't exist already
        setMessages(prevMessages => {
          // Check if this message is already in our messages array
          const messageExists = prevMessages.some(msg => 
            msg._id === message._id || 
            (msg.text === message.text && 
             msg.sender?.id === message.sender?.id &&
             Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) < 1000)
          );
          
          if (messageExists) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      };
      
      // Listen for messages
      socketRef.current.on("receive_message", handleReceiveMessage);
      
      // Clean up listener when changing chats
      return () => {
        socketRef.current.off("receive_message", handleReceiveMessage);
      };
    }
  }, [activeChatId]);

  // Initialize messages when chat changes
  useEffect(() => {
    if (activeChatId && messagesData?.data?.attributes) {
      const chatMessages = messagesData.data.attributes;
      
      // Set flag that we've initialized messages for this chat
      messagesInitializedRef.current[activeChatId] = true;
      
      // Update messages state with fetched messages
      setMessages(chatMessages);
      
      // Clear unread count when switching to a chat
      setUnreadMessages(prev => ({
        ...prev,
        [activeChatId]: 0
      }));
    }
  }, [activeChatId, messagesData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeUser?.id && activeChatId) {
      const messageData = {
        receiver: activeUser.id,
        text: newMessage,
        chatId: activeChatId
      };
      
      // Create optimistic message
      const optimisticMsg = {
        _id: `temp-${Date.now()}`,
        text: newMessage,
        sender: { id: userId },
        createdAt: new Date().toISOString(),
        chatId: activeChatId,
        pending: true
      };
      
      // Add optimistic message to UI
      setMessages(prevMessages => [...prevMessages, optimisticMsg]);
      setNewMessage("");
      
      try {
        // Send message through API
        const response = await sendMessage(messageData).unwrap();
        
        // Get the actual message ID from response
        const actualMessageId = response?.data?.id || optimisticMsg._id;
        
        // Update optimistic message with actual ID
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === optimisticMsg._id 
              ? { ...msg, _id: actualMessageId, pending: false } 
              : msg
          )
        );
        
        // Create message object for socket
        const messageForSocket = {
          _id: actualMessageId,
          text: newMessage,
          sender: { id: userId },
          receiver: { id: activeUser.id },
          createdAt: new Date().toISOString(),
          chatId: activeChatId
        };
        
        // Emit message through socket for real-time delivery
        if (socketRef.current) {
          socketRef.current.emit("send_message", {
            chatId: activeChatId,
            message: messageForSocket
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        
        // Show error state for the optimistic message
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === optimisticMsg._id 
              ? { ...msg, error: true, pending: false } 
              : msg
          )
        );
      }
    }
  };

  const handleUserSelect = (user) => {
    setActiveUser(user);
    setActiveChatId(user?.chatId);
    
    // Clear unread count for this chat
    setUnreadMessages(prev => ({
      ...prev,
      [user.chatId]: 0
    }));
    
    // Reset messages when switching chats
    setMessages([]);
    
    // If this chat hasn't been initialized yet, force a refetch
    if (!messagesInitializedRef.current[user.chatId]) {
      setTimeout(() => {
        refetchMessages();
      }, 100);
    }
    
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    // If message is from today, show only time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date
    return messageDate.toLocaleDateString();
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
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-200 relative ${activeUser?.id === user.id ? "bg-gray-200" : ""}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <img
                    src={user?.avatar}
                    alt={user.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.status}</p>
                  </div>
                  {unreadMessages[user.chatId] > 0 && (
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {unreadMessages[user.chatId]}
                    </div>
                  )}
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
          <div className="p-4 border-b bg-gray-50 flex items-center">
            {!showSidebar && activeUser && (
              <button 
                className="md:hidden mr-3 text-green-600"
                onClick={() => setShowSidebar(true)}
              >
                <Menu size={24} />
              </button>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {activeUser?.name || "Select a chat"}
              </h2>
              <p className="text-sm text-gray-500">
                {activeUser?.status || ""}
              </p>
            </div>
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
                    className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                      msg.pending 
                        ? "bg-gray-400 text-white"
                        : msg.error 
                          ? "bg-red-500 text-white" 
                          : msg.sender?.id === userId 
                            ? "bg-green-600 text-white" 
                            : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-xs ${msg.sender?.id === userId ? "text-gray-200" : "text-gray-500"}`}>
                        {formatTime(msg?.createdAt)}
                      </p>
                      {msg.pending && (
                        <span className="text-xs text-gray-200 ml-2">Sending...</span>
                      )}
                      {msg.error && (
                        <span className="text-xs text-gray-200 ml-2">Failed to send</span>
                      )}
                    </div>
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
              disabled={!activeUser}
            />
            <button
              className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 text-sm md:text-base whitespace-nowrap ${(!activeUser || !newMessage.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSendMessage}
              disabled={!activeUser || !newMessage.trim() || isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;