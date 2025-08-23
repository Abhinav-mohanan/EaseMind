import React, { useEffect, useState } from "react";
import { User,Clock } from "lucide-react";
import { ConversationsApi} from '../../api/chatApi'
import ErrorHandler from "../Layouts/ErrorHandler";

const ConversationList = ({onSelect,selectedId}) => {
  const [conversation, setConversation] = useState([]);
  const role = localStorage.getItem('role')

  const FetchConversations = async () => {
    try {
      const data = await ConversationsApi();  
      setConversation(data);
    } catch (error) {
      ErrorHandler(error);
    } 
  };

  useEffect(() => {
    FetchConversations();
  }, []);

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-6 py-5 border-b-2 border-slate-600">
        <h2 className="text-xl font-bold mb-1">Conversations</h2>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-sm">{conversation.length} active chats</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversation.map((conv, index) => (
          <div 
            key={conv.id}
            onClick={() => {
              onSelect(conv.id)              
            }}
            className={`px-6 py-5 cursor-pointer border-b border-gray-100 hover:bg-teal-50 transition-all duration-200 relative ${
              selectedId === conv.id ? 'bg-teal-50 border-l-4 border-l-teal-600 shadow-sm' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  <User className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {role === 'user' ? conv.psychologist : conv.user}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {role === 'user' ? 'Licensed Psychologist' : 'Patient'}
                </p>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
