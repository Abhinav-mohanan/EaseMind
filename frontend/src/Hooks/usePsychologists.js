import { useEffect, useState } from "react"
import {  TopPsychologists } from "../api/appointmentApi"

export const usePsychologists = () =>{
    const [psychologist,setPsychologist] = useState([])
    useEffect(()=>{
        const getPsychologist = async()=>{
            const data = await TopPsychologists()
            setPsychologist(data)
        }
        getPsychologist()
    },[])
    return psychologist
}