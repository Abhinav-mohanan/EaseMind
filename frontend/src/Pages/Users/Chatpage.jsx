import React, { useState } from 'react'
import UserSidebar from '../../Components/Users/User/UserSidebar';
import Navbar from '../../Components/Users/Common/Navbar';
import ConversationList from '../../Components/Users/Common/Conversations';
import ChatBox from '../../Components/Users/Common/Chatbox';
import PsychologistSidebar from '../../Components/Users/Psychologist/PsychologistSidebar';
import { useLocation } from 'react-router-dom';

const Chatpage = () => {
  const location = useLocation()
    const [selectedConversation,setSelectedConversation] = useState(
      location.state?.conversationId || null
    );
    const [participantName,setParticipantName] = useState('')
    const role = localStorage.getItem('role')

    const handleselectedConversation = (conv) =>{
      setSelectedConversation(conv.id);
      setParticipantName(role === 'psychologist' ? conv.user : conv.psychologist)
    }

 return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
        <Navbar />
      <div className="lg:ml-64 transition-all duration-300">
      {role === 'psychologist' ? (
        <PsychologistSidebar/>
      ) : (
        <UserSidebar/>
      )}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-2 border-gray-200" style={{ height: '80vh' }}>
              <div className="flex h-full">
                <div className="w-80 border-r-2 border-gray-200 flex flex-col bg-gray-50">
                  <ConversationList 
                    onSelect={handleselectedConversation}
                    selectedId={selectedConversation} 
                  />
                </div>    
                <div className="flex-1 flex flex-col">
                  {selectedConversation ? (
                    <ChatBox conversationId={selectedConversation} 
                    participantName={participantName} />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                      <div className="text-center max-w-md">
                        <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                          <svg className="h-12 w-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">Welcome to Your Chat</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                          Connect with your {role === 'user' ? 'licensed psychologist' : 'patients'} in a secure, 
                          professional environment. Select a conversation from the sidebar to begin.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Chatpage