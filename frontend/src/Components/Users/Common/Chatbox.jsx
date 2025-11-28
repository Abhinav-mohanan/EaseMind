import React, { useEffect, useRef, useState } from "react";
import { FetchMessagesApi, GetWebsocketTokenApi, UploadChatFileApi } from "../../../api/chatApi";
import ErrorHandler from "../../Layouts/ErrorHandler";
import { File, MessageCircle, Paperclip, Send, User, X } from "lucide-react";
import CONFIG from "../../../api/config";

const ChatBox = ({conversationId , participantName = 'Active Conversation'}) => {
  const [messages, setMessages] = useState([]);
  const [newmessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [token,setToken] = useState(null);
  const [currentUser,setCurrentUser] = useState('');
  const [file,setFile] = useState(null);
  const [fileName,setFileName] = useState(null);
  const [uploadProgress,setUploadProgress] = useState(0);
  const [isUploading,setIsUploading] = useState(false);
  const [filePreview,setFilePreview] = useState(null);
  const [onlineStatus,setOnlineStatus] = useState(false)
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(()=>{
    const fetchToken = async() =>{
      try{
        const data = await GetWebsocketTokenApi();
        setToken(data.token);
        setCurrentUser(data.user);
      }catch(error){
        ErrorHandler(error);
      }
    }
    fetchToken();
  },[]);

  const FetchMessages = async() =>{
    try{
      const data = await FetchMessagesApi(conversationId);
      setMessages(data);
      console.log(data);
    }catch(error){
      ErrorHandler(error);
    }
  }

  useEffect(()=>{
    if(!token) return;
    FetchMessages();
  },[conversationId,token]);

  useEffect(() => {
    if(!conversationId) return;
    if(!token) return;
    
    const ws = new WebSocket(`${CONFIG.WS_URL}/ws/chat/${conversationId}/?token=${token}`); 

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === 'initial_statuses'){
        const otherEntry = Object.entries(data.statuses).find(([uid])=> uid != currentUser);
        if (otherEntry){
          setOnlineStatus(otherEntry[1] === 'online')
        }
        return
      }

      if (data.event === 'status'){
        if (data.user !== currentUser){
          setOnlineStatus(data.status === 'online')
        }
        return;
      }
      setMessages((prev) => [...prev, data.message]);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    setSocket(ws);

    return () => ws.close();
  }, [conversationId,token]);

  useEffect(()=>{
    messageEndRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages,file]);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      
      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selected);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async() => {
    if (!socket) return;
    if (!newmessage.trim() && !file) return;

    let fileUrl = null;
    const messageText = newmessage;
    const messageFile = file;
    const messageFileName = fileName;

    setNewMessage("");

    try{
      if (messageFile) {
        setIsUploading(true);
        setUploadProgress(0);
        
        const data = await UploadChatFileApi(messageFile, (progressEvent)=>{
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        });
        
        fileUrl = data.file_url;
        setIsUploading(false);
        setFile(null);
        setFileName(null);
        setFilePreview(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }

      socket.send(JSON.stringify({
        message: messageText,
        file: fileUrl,
        filename: messageFileName,
      }));

    }catch(error){
      ErrorHandler(error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const groupedMessages = messages.reduce((groups,msg)=>{
    const date = new Date(msg.timestamp).toDateString();
    if(!groups[date]) groups[date] = [];
    groups[date].push(msg)
    return groups
  },{})


  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }


  return (
    <div className="flex flex-col h-full bg-[#efeae2]">
      <div className="bg-[#008069] text-white px-4 py-3 shadow-md flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-medium uppercase">{participantName}</h3>
          <p className="text-xs text-[#d1f4cc]">{onlineStatus ? '● Online':'Offline'}</p>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto px-4 py-2" 
        style={{ 
          backgroundImage: "repeating-linear-gradient(0deg, #efeae2 0px, #efeae2 50px, #e8e3dc 50px, #e8e3dc 100px)"
        }}
      >
        {messages.length > 0 ? (
          <div className="space-y-2 py-2">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="flex justify-center my-3">
                  <div className="bg-white/90 px-3 py-1 rounded-md shadow-sm">
                    <span className="text-xs text-gray-600 font-medium">
                      {formatDateLabel(date)}
                    </span>
                  </div>
                </div>
                
                {msgs.map((msg) => {
                  const isMe = msg.sender === currentUser;
                  const hasFile = !!msg.file;
                  return(
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-md ${
                        isMe
                          ? "bg-[#d9fdd3]"
                          : "bg-white"
                      } rounded-lg shadow-md px-3 py-2 mb-2 relative`}
                      style={{
                        borderRadius: isMe ? "8px 8px 0px 8px" : "8px 8px 8px 0px"
                      }}
                      >
                        {msg.text && (
                          <p className="text-sm text-gray-800 leading-relaxed mb-2">{msg.text}</p>
                        )}
                        
                        {hasFile && (
                          <div className="mt-1 mb-1">
                            {msg?.file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img
                                src={msg.file}
                                alt="attachment"
                                className="max-w-full max-h-64 rounded-md"
                              />
                            ) : (
                              <a
                                href={msg.file}
                                download={msg.filenames}
                                className="flex items-center gap-2 bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors"
                              >
                                <File className="w-5 h-5 text-gray-600"/>
                                <span className="text-sm text-gray-700 truncate max-w-xs">{msg.filenames}</span>
                              </a>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

             {isUploading && (
              <div className="flex justify-end mb-2">
                <div className="bg-[#d9fdd3] rounded-lg shadow-md p-3 max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Paperclip className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">Uploading {fileName}...</span>
                  </div>
                  <div className="w-full bg-[#a8d9a5] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#00a884] h-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-right">{uploadProgress}%</p>
                </div>
                </div>
              )}
            <div ref={messageEndRef}/>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-24 h-24 bg-[#d9fdd3] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <MessageCircle className="h-12 w-12 text-[#00a884]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">No Messages Yet</h3>
            <p className="text-center text-gray-500 max-w-sm text-sm">
              Start your conversation by sending a message below
            </p>
          </div>
        )}
      </div>

      {file && !isUploading && (
        <div className="bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
            {filePreview ? (
              <img src={filePreview} alt="preview" className="w-12 h-12 object-cover rounded" />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                <File className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate font-medium">{fileName}</p>
              <p className="text-xs text-gray-500">Ready to send</p>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#f0f2f5] px-4 py-3">
        <div className="flex items-end gap-2">
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <Paperclip className="h-6 w-6 text-[#54656f]" />
            </div>
          </label>

          <div className="flex-1 bg-white rounded-3xl shadow-sm">
            <textarea
              value={newmessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="w-full px-4 py-3 text-sm resize-none focus:outline-none bg-transparent"
              placeholder="Type a message"
              rows="1"
              style={{ minHeight: '42px', maxHeight: '100px' }}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={(!newmessage.trim() && !file) || isUploading}
            className={`p-3 rounded-full transition-all duration-200 ${
              (!newmessage.trim() && !file) || isUploading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#00a884] hover:bg-[#008069] shadow-md"
            }`}
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;