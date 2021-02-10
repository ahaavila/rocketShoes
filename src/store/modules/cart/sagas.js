// call -> serve para passar pra ele o api.get
// put -> serve para disparar uma action para o reducer
// all -> serve para cadastrar vários listeners
// takeLatest -> Se o usuário clicar no botão 2 vezes sem que a chamada a
// api tenha finalizado, o takeLatest vai chamar somente 1 vez a api.
// takeEvery -> Se o usuário clicar no botão 2 vezes sem que a chamada a
// api tenha finalizado, o takeEvey vai chamar a api 2 vezes.
import { call, put, select, all, takeLatest } from 'redux-saga/effects';

import { formatPrice } from '../../../util/format';
import { addToCartSuccess, updateAmount } from './actions';
import api from '../../../services/api';

function* addToCart({ id }) {
  // Vai acessar a API
  // Buscar as informações detalhadas do produto selecionado
  // E enviar os detalhes para o reduce cadastrar os dados no carrinho.

  // Verifico se o produto selecionado já existe no carrinho
  const productExists = yield select((state) =>
    state.cart.find((p) => p.id === id)
  );

  if (productExists) {
    const amount = productExists.amount + 1;

    yield put(updateAmount(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSuccess(data));
  }
}

export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
