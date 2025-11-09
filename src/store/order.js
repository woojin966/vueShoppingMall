// 📁 src/store/order.js
export default {
  namespaced: true,
  state: () => ({
    items: [],
    shipping: {
      name: '',
      phone: '',
      address: '',
    },
    paymentMethod: 'card',
    orderNumber: '',
  }),
  mutations: {
    setItems(state, items) {
      state.items = items
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
      state.shipping = { name: '', phone: '', address: '' }
      state.paymentMethod = 'card'
      state.orderNumber = ''
    },
  },
}
