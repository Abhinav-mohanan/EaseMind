import { createSlice } from "@reduxjs/toolkit";

export const RoleSlice = createSlice({ 
    name:'Role',
    initialState:{
        selectedRole:null,         // for role selection
    },
    reducers:{
        setRole:(state,action)=>{
            state.selectedRole = action.payload
        },
        clearRole:(state)=>{
            state.selectedRole = null
        }
    }
})
export const{setRole,clearRole} = RoleSlice.actions
export default RoleSlice.reducer