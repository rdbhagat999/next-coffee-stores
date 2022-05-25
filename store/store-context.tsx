import { createContext, useReducer } from "react";
import { CoffeeStore } from "../models/coffee-store";

interface IStoreContext {
  latLong: string;
  coffeeStores: CoffeeStore[];
}

const initialState: IStoreContext = {
  latLong: "",
  coffeeStores: [],
};

export enum ACTION_TYPES {
  SET_LAT_LONG = "SET_LAT_LONG",
  SET_COFFEE_STORES = "SET_COFFEE_STORES",
}

export interface SaveLatLongAction {
  type: ACTION_TYPES.SET_LAT_LONG;
  payload: string;
}

export interface SaveCoffeeStoresAction {
  type: ACTION_TYPES.SET_COFFEE_STORES;
  payload: CoffeeStore[];
}

type ActionStore = SaveLatLongAction | SaveCoffeeStoresAction;

const defaultDispatch: React.Dispatch<ActionStore> = () => initialState; // we never actually use this

export const StoreContext = createContext<{ state: IStoreContext; dispatch: React.Dispatch<ActionStore> }>({
  state: initialState,
  dispatch: defaultDispatch,
});

const storeReducer = (state: IStoreContext, action: ActionStore) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG:
      return {
        ...state,
        latLong: action.payload,
      };
    case ACTION_TYPES.SET_COFFEE_STORES:
      return {
        ...state,
        coffeeStores: action.payload,
      };
    default:
      throw new Error("Unhandled action type");
  }
};

const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
