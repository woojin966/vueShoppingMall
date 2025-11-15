// 📁 src/store/order.js
export default {
  namespaced: true,
  state: () => ({
    items: [],
    customer: { name: '', phone: '', email: '' },
    shipping: {
      name: '',
      phone: '',
      email: '',
      address: '',
      detailAddress: '',
      message: '',
    },
    paymentMethod: 'card',
    orderNumber: '',
  }),
  mutations: {
    setItems(state, items) {
      state.items = items
    },
    setCustomer(state, customer) {
      state.customer = customer
    },
    setShipping(state, shipping) {
      state.shipping = shipping
    },
    setPaymentMethod(state, method) {
      state.paymentMethod = method
    },
    setOrderNumber(state, orderNo) {
      state.orderNumber = orderNo
    },
    clearOrder(state) {
      state.items = []
      state.customer = { name: '', phone: '', email: '' }
      state.shipping = {
        name: '',
        phone: '',
        email: '',
        address: '',
        detailAddress: '',
        message: '',
      }
      state.paymentMethod = 'card'
      state.orderNumber = ''
    },
  },
}
