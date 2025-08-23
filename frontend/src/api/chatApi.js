import axiosInstance from "./axiosInstance"

export const CreateConversationApi = async(appointment_id)=>{
    const response = await axiosInstance.post('chat/conversation/create/',{appointment_id})
    return response.data
}

export const ConversationsApi = async()=>{
    const response = await axiosInstance.get('chat/conversations/')
    return response.data
}

export const FetchMessagesApi = async(conversationId) =>{
    const response = await axiosInstance.get(`chat/messages/${conversationId}/`)
    return response.data
}

export const GetWebsocketTokenApi = async() =>{
    const response = await axiosInstance.get('chat/ws-token/')
    return response.data
}