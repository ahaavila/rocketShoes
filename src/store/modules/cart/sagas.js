// call -> serve para passar pra ele o api.get
// put -> serve para disparar uma action para o reducer
// all -> serve para cadastrar vários listeners
// takeLatest -> Se o usuário clicar no botão 2 vezes sem que a chamada a
// api tenha finalizado, o takeLatest vai chamar somente 1 vez a api.
// takeEvery -> Se o usuário clicar no botão 2 vezes sem que a chamada a
// api tenha finalizado, o takeEvey vai chamar a api 2 vezes.
import { call, put, select, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import history from '../../../services/history';

import { formatPrice } from '../../../util/format';
import { addToCartSuccess, updateAmountSuccess } from './actions';

function* addToCart({ id }) {
  // Vai acessar a API
  // Buscar as informações detalhadas do produto selecionado
  // E enviar os detalhes para o reduce cadastrar os dados no carrinho.

  // Verifico se o produto selecionado já existe no carrinho
  const productExists = yield select((state) =>
    state.cart.find((p) => p.id === id)
  );

  // Pego o estoque do produto selecionado
  const stock = yield call(api.get, `/stock/${id}`);
  // jogo para uma variavel a quantidade do estoque
  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0;

  const amount = currentAmount + 1;

  // Verifico se a quantidade selecionada é maior que a quantidade em estoque
  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque');
    return;
  }

  if (productExists) {
    yield put(updateAmountSuccess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSuccess(data));
    history.push('/cart');
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return;

  const stock = yield call(api.get, `stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque');
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
