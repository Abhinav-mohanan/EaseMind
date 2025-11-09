import React, { useEffect, useRef, useState } from "react";
import { FetchMessagesApi, GetWebsocketTokenApi } from "../../../api/chatApi";
import ErrorHandler from "../../Layouts/ErrorHandler";
import { MessageCircle, Send } from "lucide-react";
import CONFIG from "../../../api/config";

const ChatBox = ({conversationId}) => {
  const [messages, setMessages] = useState([]);
  const [newmessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [token,setToken] = useState(null)
  const [currentUser,setCurrentUser] = useState('')
  const messageEndRef = useRef(null)

  useEffect(()=>{
    const fetchToken = async() =>{
      try{
        const data = await GetWebsocketTokenApi()
        setToken(data.token)
        setCurrentUser(data.user)
      }catch(error){
        ErrorHandler(error)
      }
    }
    fetchToken()
  },[])

    const FetchMessages = async() =>{
    try{
      const data = await FetchMessagesApi(conversationId)
      setMessages(data)
    }catch(error){
      ErrorHandler(error)
    }
  }

  useEffect(()=>{
    if(!token) return
    FetchMessages()
  },[conversationId,token])


  useEffect(() => {
    if(!conversationId) return;

    if(!token) return;
    
    const ws = new WebSocket(`${CONFIG.WS_URL}/ws/chat/${conversationId}/?token=${token}`); 

    ws.onopen = () => {
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data.message]);
    };

    ws.onclose = () => {
    };

    setSocket(ws);

    return () => ws.close();
  }, [conversationId,token]);

  useEffect(()=>{
    messageEndRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages])

  const sendMessage = () => {
    if (socket && newmessage.trim()) {
      socket.send(JSON.stringify({ message: newmessage}));
      setNewMessage("");
    }
  };


 return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-6 py-4 border-b-2 border-slate-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Active Conversation</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          {messages.length > 0 ? (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === currentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-md ${
                    msg.sender === currentUser
                      ? "bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl rounded-br-sm shadow-lg"
                      : "bg-white text-gray-800 rounded-r-2xl rounded-tl-2xl rounded-bl-sm shadow-md border border-gray-200"
                  } px-5 py-3 relative`}>
                    <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                    <div className={`text-xs mt-2 ${
                      msg.sender === currentUser ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef}/>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-16">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-600">No Messages Yet</h3>
              <p className="text-center text-gray-500 max-w-sm">
                This is the beginning of your conversation. Send a message to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t-2 border-gray-200 px-6 py-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <textarea
              value={newmessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Type your message here..."
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newmessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <Send className="h-5 w-5" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;