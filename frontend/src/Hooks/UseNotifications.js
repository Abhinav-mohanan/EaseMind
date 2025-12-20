import { useState, useEffect, useCallback, useRef } from 'react';
import { GetNotificationsApi } from '../api/notificationApi';
import { GetWebsocketTokenApi } from '../api/chatApi';
import ErrorHandler from '../Components/Layouts/ErrorHandler';
import CONFIG from '../api/config';

export const useNotifications = (isAuthenticated) => {
  const [notifications, setNotifications] = useState([]);
  const [token, setToken] = useState(null);
  const wsRef = useRef(null)


  const fetchNotifications = async (filter='unread') => {
      try {
        const data = await GetNotificationsApi(filter);
        setNotifications(data);
      } catch (error) {
        ErrorHandler(error);
      }
    };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchToken = async () => {
      try {
        const data = await GetWebsocketTokenApi();
        setToken(data.token);
      } catch (error) {
        ErrorHandler(error);
      }
    };
    fetchToken();
  }, [isAuthenticated]);

  useEffect(() => {
  if (!token || !isAuthenticated) return;

  if (wsRef.current){
    console.log('WebSocket already connected');
    return;
  }

  const ws = new WebSocket(`${CONFIG.WS_URL}/ws/notifications/?token=${token}`);
  wsRef.current = ws;

  ws.onopen = () => console.log("WebSocket connected");
  ws.onclose = () => {
    console.log("WebSocket disconnected");
    wsRef.current = null; 
  };

  ws.onmessage = (event) => {
    const newNotification = JSON.parse(event.data);
    setNotifications((prev) => [newNotification, ...prev]);
  };

  return () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };
}, [token, isAuthenticated]);


  return { notifications,fetchNotifications}
};