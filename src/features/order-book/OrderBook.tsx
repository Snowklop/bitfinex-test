import { useState, useEffect, useCallback } from "react";
import styled from 'styled-components/macro';
import OrderBookTable from "./OrderBookTable";
import OrderBookTitle from "./OrderBookTitle";


const StyledOrderBook = styled.div`
  background-color: rgb(28,38,54);
  border-radius: 3px;
`

export default function OrderBook() {
  const [socket, setSocket] = useState<WebSocket | undefined>();

  const [isLoading, setLoading] = useState(true);

  const connect = useCallback(() => {
    const newSocket = new WebSocket(process.env.REACT_APP_BITFINEX_WS_URL as string)
    newSocket.onopen = () => {
      setLoading(false);
    }
    newSocket.onclose = function(e) {
      setTimeout(function() {
        connect();
      }, 1000);
    };
  
    newSocket.onerror = function(err) {
      newSocket.close();
    };
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    return function cleanup() {
      if(socket) {
        socket.removeEventListener('close', connect);
        socket.close();
      }
    };
  }, [socket, connect])

  return (
    <StyledOrderBook>
      {(socket && !isLoading) ? (
        <>
          <OrderBookTitle />
          <OrderBookTable socket={socket} />
        </>
      ): <div>Loading...</div>}
    </StyledOrderBook>
  );
}
