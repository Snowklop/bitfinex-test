import { useCallback } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  collapse,
  selectCollapsed,
  selectCurrencyPair,
  selectPrecision,
  setPrecision,
} from "./orderBookSlice";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid rgb(154, 160, 168);
  margin-bottom: 1rem;
`;

const ArrowDown = styled.i`
  cursor: pointer;
  border: solid rgb(154, 160, 168);
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
`;

const ArrowRight = styled.i`
  cursor: pointer;
  border: solid rgb(154, 160, 168);
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
`;

const Title = styled.span`
  font-size: 120%;
  color: white;
  padding: 0.5rem;
`;

const CurrencyPair = styled.span`
  color: rgb(154, 160, 168);
  font-size: 120%;
`;

const Actions = styled.div`
   display: flex;
   flex: 1;
   flex-direction: row;
   align-items: center;
   justify-content: end;
   margin-right: 1rem;
   color: white;
`;

interface PrecisionButtonProps {
  disabled: boolean;
}


const PrecisionButton = styled.div<PrecisionButtonProps>`
   padding: 0.2rem;
   margin: 0.2rem;
   border: 1px solid white;
   border-radius: 5px;
   border-color: ${(props) => (props.disabled ? "rgb(58,69,83)" : "white")};
   color: ${(props) => (props.disabled ? "rgb(58,69,83)" : "white")};
   cursor: ${(props) => (props.disabled ? "disabled" : "pointer")};
`;

export default function OrderBookTitle() {
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector(selectCollapsed);

  const toggleCollapse = useCallback(() => {
    dispatch(collapse(!isCollapsed));
  }, [dispatch, isCollapsed]);

  const { baseCurrency, quoteCurrency } = useAppSelector(selectCurrencyPair);

  const precision = useAppSelector(selectPrecision);

  const increasePrecision = useCallback(() => {
    dispatch(setPrecision(precision + 1));
  }, [dispatch, precision]);

  const descreasePrecision = useCallback(() => {
    dispatch(setPrecision(precision - 1));
  }, [dispatch, precision]);

  return (
    <Wrapper>
      {isCollapsed ? (
        <ArrowRight onClick={toggleCollapse} />
      ) : (
        <ArrowDown onClick={toggleCollapse} />
      )}
      <Title>ORDER BOOK</Title>
      <CurrencyPair>{`${baseCurrency}/${quoteCurrency}`}</CurrencyPair>
      <Actions>
        <PrecisionButton
          disabled={precision <= 0}
          onClick={precision <= 0 ? undefined : descreasePrecision}
        >
          {"<- .0"}
        </PrecisionButton>
        <PrecisionButton
          disabled={precision >= 5}
          onClick={precision >= 5 ? undefined : increasePrecision}
        >
          {"-> .00"}
        </PrecisionButton>
      </Actions>
    </Wrapper>
  );
}
