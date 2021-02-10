import { all } from 'redux-saga/effects';

import cart from './cart/sagas';

export default function* rootSaga() {
  // Caso tenhamos mais metodos, é só adicionar junto com o cart.
  return yield all([cart]);
}
