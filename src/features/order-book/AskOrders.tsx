import * as React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import { selectAskItems } from './orderBookSlice';
import OrderRow from './OrderRow';

const StyledAskOrders = styled.div`
display: flex;
flex: 1;
flex-direction: column;
`

export default function AskOrders () {

  const items = useAppSelector(selectAskItems)

  return (
    <StyledAskOrders>
      {Object.entries(items).map(([key, value]) => <OrderRow key={key} price={parseInt(key)} amount={-value.amount} count={value.count} isBid={false} />)}
    </StyledAskOrders>
  );
}
