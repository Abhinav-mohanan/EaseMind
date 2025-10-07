import axiosInstance from "./axiosInstance";

export const GetNotificationsApi = async (filter) => {
  const response = await axiosInstance.get("/notifications/",
    {params:{filter}}
  )
  return response.data;
};

export const MarkAllAsReadApi = async() =>{
  const response = await axiosInstance.patch('/notifications/mark-read/')
  return response.data
}

export const ClearAllNotificationsApi  = async() =>{
  const response = await axiosInstance.delete('/notifications/clear/')
  return response.data
}
