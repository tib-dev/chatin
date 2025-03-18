export const signalingMiddleware = (store) => {
  const ws = new WebSocket("ws://localhost:5000");

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    const dispatch = store.dispatch;

    if (data.offer)
      dispatch({ type: "signaling/setOffer", payload: data.offer });
    if (data.answer)
      dispatch({ type: "signaling/setAnswer", payload: data.answer });
    if (data.iceCandidate)
      dispatch({
        type: "signaling/addIceCandidate",
        payload: data.iceCandidate,
      });
  };

  return (next) => (action) => {
    if (action.type === "signaling/sendSignal") {
      ws.send(JSON.stringify(action.payload));
    }
    return next(action);
  };
};
