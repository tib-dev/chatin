import { createSlice } from "@reduxjs/toolkit";

const signalingSlice = createSlice({
  name: "signaling",
  initialState: {
    offer: null,
    answer: null,
    iceCandidates: [],
    connected: false,
  },
  reducers: {
    setOffer: (state, action) => {
      state.offer = action.payload;
    },
    setAnswer: (state, action) => {
      state.answer = action.payload;
    },
    addIceCandidate: (state, action) => {
      state.iceCandidates.push(action.payload);
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
  },
});

export const { setOffer, setAnswer, addIceCandidate, setConnected } =
  signalingSlice.actions;
export default signalingSlice.reducer;
