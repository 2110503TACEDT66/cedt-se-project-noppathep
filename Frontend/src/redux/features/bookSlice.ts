import { configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ReservationItem} from "../../../interface.js";

type BookState = {
    bookItems:ReservationItem[]
}

const initialState:BookState={bookItems:[]}

export const bookSlice = createSlice({
    name:"book",
    initialState,
    reducers:{
        addBooking: (state, action: PayloadAction<ReservationItem>) => {
            console.log("Add success");
            const { _id } = action.payload;
            const existingBookingIndex = state.bookItems.findIndex(item => item._id === _id);
            if (existingBookingIndex !== -1) {
                state.bookItems[existingBookingIndex] = action.payload;
            } else {
                state.bookItems.push(action.payload);
            }
        }
        ,
        removeBooking: (state,action:PayloadAction<string>)=>{
            const remainItem = state.bookItems.filter(obj =>{
                return ((obj._id!=action.payload))
            })
            state.bookItems = remainItem
        }
}
})

export const {addBooking,removeBooking} = bookSlice.actions
export default bookSlice.reducer
