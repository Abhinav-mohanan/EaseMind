import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetZegoTokenApi } from '../../api/videocallApi';
import ErrorHandler from '../../Components/Layouts/ErrorHandler';
import Loading from '../../Components/Layouts/Loading';


export default function VideoCall() {
  const { appointment_id } = useParams();
  const role = localStorage.getItem('role')
  const navigate = useNavigate()
  const containerRef = useRef(null);
  const zpRef = useRef(null)
  const [isLoading,setIsLoading] = useState(false)
  const leaving_url = 
        role === 'psychologist' 
        ? `/psychologist/appointment/${appointment_id}`
        :`/user/appointment/${appointment_id}`

  const initZego = async() =>{
    try{
      setIsLoading(true)
      const data = await GetZegoTokenApi(appointment_id)
      const{token,app_id,room_id,user_id,user_name} = data
      if(!zpRef.current){

        const kittoken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          Number(app_id),
          token,
          room_id,
          user_id,
          user_name
        );
        zpRef.current = ZegoUIKitPrebuilt.create(kittoken);
        zpRef.current.joinRoom({
          container:containerRef.current,
          scenario:{
            mode:ZegoUIKitPrebuilt.OneONoneCall,
          },
          sharedLinks:[
            {
              name:'personal link',
              url:`${window.location.protocol}//${window.location.host}${window.location.pathname}?videocall_id=${room_id}`
            }
          ],
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          onLeaveRoom: ()=>{
            if (zpRef.current){
              zpRef.current.destroy();
              zpRef.current = null;
            }
            navigate(leaving_url);
            window.location.reload()
          }
        });
      }
      }catch(error){
        ErrorHandler(error)
      }finally{
        setIsLoading(false)
      }
    }

  useEffect(()=>{
    initZego()
    return ()=>{
      if(zpRef.current){
        zpRef.current.destroy();
        zpRef.current = null
      }
    }
  },[appointment_id])

  return (
    <Loading isLoading={isLoading}>
    <h2>Personal video call</h2>
    <div
      className="w-full h-full"
      ref={containerRef}
      ></div>
      </Loading>
  );
}
