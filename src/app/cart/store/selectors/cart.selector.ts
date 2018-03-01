import { MemoizedSelector, createSelector } from '@ngrx/store';

import * as fromFeature from './../reducers';
import * as fromCart from './../reducers/cart.reducer';

export const getCartState: MemoizedSelector<
  any,
  fromCart.CartState
> = createSelector(
  fromFeature.getCartState,
  (cartState: fromFeature.CartState) => cartState.active
);

export const getActiveCart: MemoizedSelector<any, any> = createSelector(
  getCartState,
  fromCart.getCartContent
);

export const getRefresh: MemoizedSelector<any, boolean> = createSelector(
  getCartState,
  fromCart.getRefresh
);

export const getEntriesMap: MemoizedSelector<any, any> = createSelector(
  getCartState,
  fromCart.getEntries
);

export const getEntrySelectorFactory = (
  productCode
): MemoizedSelector<any, any> => {
  return createSelector(getEntriesMap, entries => {
    if (entries) {
      return entries[productCode];
    }
  });
};

export const getEntries: MemoizedSelector<
  any,
  any
> = createSelector(getEntriesMap, entities => {
  return Object.keys(entities).map(code => entities[code]);
});
