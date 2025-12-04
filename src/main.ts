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
import { IOrderRequest } from './types';
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
const cart = new Cart();
const buyer = new Buyer();

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

events.on('catalog:changed', () => {
  const itemCards = products.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
    return card.render(item);
  });
  gallery.render({ catalog: itemCards })
});

events.on('card:select', (event: {id: string}) => {
  products.setSelectedProduct(event.id);
  const product = products.getProductById(event.id);
  if (!product) return;
  const productInCart = cart.isProductInCart(event.id);
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
    
  modal.render({ content: card.render(product, productInCart) });
  modal.open(); 
})

events.on('card:add-product', (event: {id: string}) => {
  const product = products.getProductById(event.id);
  if (!product) return;
  cart.addProductToCart(product);
  header.counter = cart.getTotalCartProducts();
})

events.on('card:remove-product', (event: {id: string}) => {
  const product = products.getProductById(event.id);
  if (!product) return;
  cart.removeProductFromCart(product);
  header.counter = cart.getTotalCartProducts();
})

events.on('cart-counter:changed', () => {
  header.counter = cart.getTotalCartProducts();
});

events.on('cart:open', () => {
  const basket = new BasketView(cloneTemplate(basketTemplate), events); 

  const basketList = cart.getCartProducts();

  const basketItems = basketList.map((item, index) => {
    const basketProduct = new CardBasket(cloneTemplate(cardBasketTemplate), events);

    basketProduct.index = index + 1;
    basketProduct.title = item.title;
    basketProduct.price = item.price;

    return basketProduct.render(item);
  })

  basket.basket = basketItems;
  basket.total = cart.getTotalCartPrice();

  modal.render({ content: basket.render()});
  modal.open();
})

events.on('cart:order', () => {
  const order = new FormOrder(cloneTemplate(formOrderTemplate), {
    onAddressInput: (address) => {
      buyer.setBuyerData({ address });
      const errors = buyer.sumAddressErrors();
      order.isAddressValid(errors);
    },
    onSubmit: () => {;
      const orderDetails = order.orderData;
        buyer.setBuyerData({
        payment: orderDetails.payment,
        address: orderDetails.address,
      });
    },

    onPaymentSelect: (payment) => buyer.setBuyerData({ payment }),
    }, 
    events
  );

  order.payment = buyer.getBuyerData()?.payment || 'card';
  order.address = buyer.getBuyerData()?.address || '';

  modal.render({ content: order.render() });
  modal.open();
})

events.on('cart:contacts', () => {
  const contacts = new FormContacts(cloneTemplate(formContactsTemplate), {
    onEmailInput: (email) => {
            buyer.setBuyerData({ email });
            const errors = buyer.sumContactsErrors();
            contacts.isContactsValid(errors);
    },
    onPhoneInput: (phone) => {
            buyer.setBuyerData({ phone });
            const errors = buyer.sumContactsErrors();
            contacts.isContactsValid(errors);
    },
    onSubmit: async () => {
      const contactsDetails = contacts.contactsData;
      buyer.setBuyerData({
        email: contactsDetails.email,
        phone: contactsDetails.phone,
      });

      const orderData: IOrderRequest = {
        payment: buyer.getBuyerData()?.payment ?? 'card',
        email: contactsDetails.email,
        phone: contactsDetails.phone,
        address: buyer.getBuyerData()?.address ?? 'test',
        total: cart.getTotalCartPrice(),
        items: cart.getCartProducts().map(p => p.id),
      };

      try {
        const result = await api.createOrder(orderData);
        events.emit('cart:success', result);
      } catch (err) {
        console.error(err);
      }
    },
  });

  modal.render({ content: contacts.render() });
  modal.open();
})

function cleanupAfterSuccess() {
  cart.clearCart();
  header.counter = cart.getTotalCartProducts();
  buyer.clearBuyerData();
}

events.on('cart:success', (result: { total: number }) => {
  const success = new SuccessView(cloneTemplate(successTemplate), {
    onOrdered: () => {
      modal.close();
    }
  });

  success.total = result.total;
  modal.render({ content: success.render() });
  modal.open();
  cleanupAfterSuccess();
})

api.getCatalog()
  .then(catalog => catalog.items.map(product => (
    { ...product, image: `${CDN_URL}/${product.image}`.replace('svg', 'png') }
  )))
  .then(productsWithImages => {
    products.setProducts(productsWithImages);
  })
  .catch(error => console.error('Ошибка загрузки каталога', error));