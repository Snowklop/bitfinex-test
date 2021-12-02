import * as React from 'react';
import styled from 'styled-components';

export interface IOrderRowProps {
  count: number;
  price: number;
  amount: number;
  isBid: boolean;
}

interface OrderRowStyledProps {
  isBid: boolean;
}

const OrderRowStyled = styled.div<OrderRowStyledProps>`
   background-color: ${props => props.isBid ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)"};
   color: white;
   display: flex;
   flex: 1;
`

export default function OrderRow ({ price, amount, count, isBid }: IOrderRowProps) {
  return (
    <OrderRowStyled isBid={isBid}>
      Price: {price} Amount: {amount} Count: {count}
    </OrderRowStyled>
  );
}
