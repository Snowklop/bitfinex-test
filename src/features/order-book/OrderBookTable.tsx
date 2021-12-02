import { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AskOrders from './AskOrders';
import BidOrders from './BidOrders';
import { addItem, addItems, selectCollapsed, selectCurrencyPair, selectPrecision } from './orderBookSlice';

export interface IOrderBookTableProps {
  socket: WebSocket
}

export enum EventType {
  INFO = 'info',
  SUBSCRIBED = 'subscribed',
}

export interface BitfinexInfoEvent {
  event: EventType.INFO;
  version: number;
  serverId: string;
  chanId?: string;
  channel?: string;
}

export interface BitfinexSubscribedEvent {
  event: EventType.SUBSCRIBED;
  chanId: string;
  channel: string;
}

export interface BookEvent extends Array<number>{}

type BitfinexEvent = BitfinexInfoEvent | BitfinexSubscribedEvent;

const StyledWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: start;
justify-content: space-evenly;
`

export default function OrderBookTable ({ socket }: IOrderBookTableProps) {

  const { baseCurrency, quoteCurrency } = useAppSelector(selectCurrencyPair);

  const dispatch = useAppDispatch();

  const isCollapsed = useAppSelector(selectCollapsed);

  const [channelId, setChannelId] = useState<string | undefined>();

  const precision = useAppSelector(selectPrecision);
  const tradingCurrencyPair = "t" + `${baseCurrency}${quoteCurrency}`.toUpperCase();
  
  const processBookEvent = useCallback((message: BookEvent) => {
    const [ , bookEvents ] = message;
    if(Array.isArray(bookEvents) && Array.isArray(bookEvents[0])) {
      dispatch(addItems(bookEvents));
    } else if(Array.isArray(bookEvents)) {
      dispatch(addItem(bookEvents));
    }
  }, [dispatch])

  const processEventMessage = useCallback((message: BitfinexEvent) => {
    switch(message.event) {
      case EventType.INFO: {
        break;
      }
      case EventType.SUBSCRIBED: {
        setChannelId((prevValue) => {
          if(prevValue) {
            socket.send(JSON.stringify({
              event: 'unsubscribe',
              chanId: prevValue
            }))
          }
          return message.chanId;
        });
        break;
      }
    }
  }, [setChannelId, socket]);

  const processSocketMessage = useCallback((message: MessageEvent) => {
    const body = JSON.parse(message.data);
    if(body.event) processEventMessage(body);
    else processBookEvent(body)
  }, [processEventMessage, processBookEvent])

  useEffect(() => {
    socket.addEventListener('message', processSocketMessage);
    return function cleanup() {
      socket.removeEventListener('message', processSocketMessage);
    }
  }, [socket, processSocketMessage])

  useEffect(() => {
    return function cleanup() {
      if(channelId) {
        socket.send(JSON.stringify({
          event: 'unsubscribe',
          chanId: channelId
        }))
      }
    }
  }, [socket, channelId])

  useEffect(() => {
    const message = JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      symbol: tradingCurrencyPair,
      precision
    });
    socket.send(message);
  }, [tradingCurrencyPair, precision, socket])

  return (
    <StyledWrapper>
      {!isCollapsed &&
      <>
      <BidOrders/>
      <AskOrders/>
      </>
      }
    </StyledWrapper>
  );
}
