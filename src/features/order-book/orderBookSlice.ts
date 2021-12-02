import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface BookItem{
  count: number,
  amount: number,
}

export interface BookItems{
  [price: string]: BookItem
}

export interface OrderBookState {
  isCollapsed: boolean;
  currencyPair: {
    baseCurrency: string;
    quoteCurrency: string;
  },
  precisionLevel: number;
  bidItems: BookItems;
  askItems: BookItems;
  
}

const initialState: OrderBookState = {
  isCollapsed: false,
  currencyPair: {
    baseCurrency: 'BTC',
    quoteCurrency: 'USD'
  },
  bidItems: {},
  askItems: {},
  precisionLevel: 0,
};

export const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    collapse: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    },
    addItems: (state, action: PayloadAction<number[][]>) => {
      const bidItems: BookItems = {};
      const askItems: BookItems = {};
      action.payload.forEach(([price, count, amount]) => {
        if(count === 0) return;
        if(amount < 0) {
          askItems[`${price}`] = { count, amount };
        }
        else {
          bidItems[`${price}`] = { count, amount };
        }
      });
      state.askItems = askItems;
      state.bidItems = bidItems;
    },
    setPrecision: (state, action: PayloadAction<number>) => {
      state.askItems = {};
      state.bidItems = {};
      state.precisionLevel = action.payload;
    },
    addItem: (state, action: PayloadAction<number[]>) => {
      const [price, count, amount] = action.payload;
      if(count === 0) {
        if(amount < 0) delete state.askItems[`${price}`]
        else delete state.bidItems[`${price}`]
      }
      else {
        if(amount < 0) {
          state.askItems[`${price}`] = { count, amount };
        }
        else {
          state.bidItems[`${price}`] = { count, amount };
        }
      }
    }
  },
});

export const { collapse, addItems, addItem, setPrecision } = orderBookSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCollapsed = (state: RootState) => state.orderBook.isCollapsed;

export const selectCurrencyPair = (state: RootState) => state.orderBook.currencyPair;

export const selectPrecision = (state: RootState) => state.orderBook.precisionLevel;
export const selectBidItems = (state: RootState) => state.orderBook.bidItems;
export const selectAskItems = (state: RootState) => state.orderBook.askItems;

export default orderBookSlice.reducer;
