import * as React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import { selectBidItems } from './orderBookSlice';
import OrderRow from './OrderRow';

const StyledBidOrders = styled.div`
display: flex;
flex: 1;
flex-direction: column;
`

export default function BidOrders () {

  const items = useAppSelector(selectBidItems)

  return (
    <StyledBidOrders>
      {Object.entries(items).map(([key, value]) => <OrderRow key={key} price={parseInt(key)} amount={value.amount} count={value.count} isBid />)}
    </StyledBidOrders>
  );
}
