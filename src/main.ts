import './scss/styles.scss';

import { Products } from './components/models/ProductsModel';
import { Cart } from './components/models/CartModel';
import { Buyer } from './components/models/BuyerModel';
import type { IProduct } from './types';        // Типы
import { apiProducts } from './utils/data';     // Мок-данные из стартера
import { AppApi } from './components/AppApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// Создаём API
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi);

const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// ProductsModel
console.log('Сохранение текущего товара');
productsModel.setItems(apiProducts.items as IProduct[]);

console.log('Массив товаров из каталога: ', productsModel.getItems());

const firstId = (apiProducts.items as IProduct[])[0]?.id;
console.log('Товар из каталога по id:', productsModel.getItem(firstId));

productsModel.setSelectedProduct((apiProducts.items as IProduct[])[0]);
console.log('Текущий товар:');
console.log(productsModel.getSelectedProduct());

// CartModel
console.log('Добавление товара в корзину');
const purchasable = (apiProducts.items as IProduct[]).filter(p => p.price !== null);
if (purchasable[0]) cartModel.addItem(purchasable[0]);
if (purchasable[1]) cartModel.addItem(purchasable[1]);

console.log('Массив товаров в корзине:', cartModel.getItems());

console.log('Стоимость всех товаров:', cartModel.getTotal());
console.log('Количество товаров в корзине:', cartModel.getCount());

console.log('Проверка наличия товара в корзине (есть)', purchasable[0] ? cartModel.hasItem(purchasable[0].id) : false);
console.log('Проверка наличия товара в корзине (нет)', false);

console.log('Удаление товара из корзины');
if (purchasable[0]) cartModel.removeItem(purchasable[0].id);

console.log('Очистка корзины');
cartModel.clear();

// BuyerModel
console.log('Сохранение способа оплаты');
buyerModel.setData({ payment: 'cash' });

console.log('Сохранение адреса доставки');
buyerModel.setData({ address: '143004, Москва, ул. Пушкина, д. 4, стр. 1, кв. 44' });

console.log('Сохранение email');
buyerModel.setData({ email: 'kirill67_44@yandex.ru' });

console.log('Сохранение телефона');
buyerModel.setData({ phone: '+7 (900) 554-44-00' });

console.log('Данные покупателя', buyerModel.getData());

console.log('Очистка данных покупателя');
buyerModel.clear();

console.log('Данные покупателя после очистки', buyerModel.getData());

console.log('Проверка данных покупателя', buyerModel.validate());

console.log('Получение всех товаров');

(async () => {
  try {
    // загрузка каталога
    const serverProducts = await api.getProductList();

    console.log('Сохранение полученных товаров в модель');
    productsModel.setItems(serverProducts);

    console.log('Сохраненные товары', productsModel.getItems());
  } catch (e) {
    console.error('Ошибка при загрузке каталога:', e);
  }
})();
