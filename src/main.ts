import './scss/styles.scss';
import { Products } from './components/models/ProductsModel';
import { Cart } from './components/models/CartModel';
import { Buyer } from './components/models/BuyerModel';
import { AppApi } from './components/AppApi'
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { GalleryView } from './components/views/GalleryView';
import { HeaderView } from './components/views/HeaderView';
import { CardCatalog } from './components/views/Card/CardCatalog';
import { IOrderRequest, IBuyer } from './types';
import { CardPreview } from './components/views/Card/CardPreview';
import { ModalView } from './components/views/ModalView';
import { BasketView } from './components/views/BasketView';
import { CardBasket } from './components/views/Card/CardBasket';
import { FormOrder } from './components/views/Form/FormOrder';
import { FormContacts } from './components/views/Form/FormContacts';
import { SuccessView } from './components/views/SuccessView';

const events = new EventEmitter();
const api = new AppApi(API_URL);

const products = new Products(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const header = new HeaderView(ensureElement<HTMLElement>('.header'), events);
const gallery = new GalleryView(ensureElement<HTMLElement>('.page__wrapper'));
const modal = new ModalView(ensureElement<HTMLElement>('.modal'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new FormOrder(cloneTemplate(formOrderTemplate), events);
const contactsForm = new FormContacts(cloneTemplate(formContactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), {
  onOrdered: () => {
    modal.close();
  },
});

events.on('catalog:changed', () => {
  const itemCards = products.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
    return card.render(item);
  });
  gallery.render({ catalog: itemCards });
});


events.on('card:select', (event: { id: string }) => {
  products.setSelectedProduct(event.id);
});

events.on('product:changed', (event: { id: string }) => {
  const product = products.getProductById(event.id);
  if (!product) {
    return;
  }

  const productInCart = cart.isProductInCart(event.id);

  modal.render({
    content: cardPreview.render(product, productInCart),
  });
  modal.open();
});

events.on('card:add-product', (event: { id: string }) => {
  const product = products.getProductById(event.id);
  if (!product) {
    return;
  }
  
  cart.addProductToCart(product);
});

events.on('card:remove-product', (event: { id: string }) => {
  const product = products.getProductById(event.id);
  if (!product) {
    return;
  }

  cart.removeProductFromCart(product);
});

events.on('basket:change', () => {
  const basketList = cart.getCartProducts();

  const basketItems = basketList.map((item, index) => {
    const basketProduct = new CardBasket(cloneTemplate(cardBasketTemplate), events);

    basketProduct.index = index + 1;
    basketProduct.title = item.title;
    basketProduct.price = item.price;

    return basketProduct.render(item);
  });

  basket.basket = basketItems;
  basket.total = cart.getTotalCartPrice();
  header.counter = cart.getTotalCartProducts();
});

events.on('cart:open', () => {
  modal.render({ content: basket.render() });
  modal.open();
});

events.on('buyer:change', (data: Partial<IBuyer>) => {
  buyer.setBuyerData(data);
});

events.on('buyer:changed', () => {
  const buyerData = buyer.getBuyerData();

  // Обновляем форму заказа (шаг 1)
  orderForm.address = buyerData?.address ?? '';
  orderForm.payment = buyerData?.payment ?? 'card';
  orderForm.isAddressValid(buyer.sumAddressErrors());

  // Обновляем форму контактов (шаг 2)
  contactsForm.email = buyerData?.email ?? '';
  contactsForm.phone = buyerData?.phone ?? '';
  contactsForm.isContactsValid(buyer.sumContactsErrors());
});

events.on('cart:order', () => {
  const buyerData = buyer.getBuyerData();

  orderForm.payment = buyerData?.payment ?? 'card';
  orderForm.address = buyerData?.address ?? '';

  const addressErrors = buyer.sumAddressErrors();
  orderForm.isAddressValid(addressErrors);

  modal.render({ content: orderForm.render() });
  modal.open();
});

events.on('order:submit', () => {
  modal.render({ content: contactsForm.render() });
  modal.open();
});

events.on('cart:contacts', () => {
  const buyerData = buyer.getBuyerData();

  contactsForm.email = buyerData?.email ?? '';
  contactsForm.phone = buyerData?.phone ?? '';
  contactsForm.isContactsValid(buyer.sumContactsErrors());

  modal.render({ content: contactsForm.render() });
  modal.open();
});

events.on('contacts:submit', async () => {
  const buyerData = buyer.getBuyerData();

  if (!buyerData) {
    return;
  }

  const orderData: IOrderRequest = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: cart.getTotalCartPrice(),
    items: cart.getCartProducts().map((p) => p.id),
  };

  try {
    const result = await api.createOrder(orderData);
    events.emit('cart:success', result);
  } catch (err) {
    console.error(err);
  }
});

function cleanupAfterSuccess() {
  cart.clearCart();
  header.counter = cart.getTotalCartProducts();
  buyer.clearBuyerData();
}

events.on('cart:success', (result: { total: number }) => {
  successView.total = result.total;

  modal.render({ content: successView.render() });
  modal.open();

  cleanupAfterSuccess();
});

api.getCatalog()
  .then(catalog => catalog.items.map(product => (
    { ...product, image: `${CDN_URL}/${product.image}`.replace('svg', 'png') }
  )))
  .then(productsWithImages => {
    products.setProducts(productsWithImages);
  })
  .catch(error => console.error('Ошибка загрузки каталога', error));