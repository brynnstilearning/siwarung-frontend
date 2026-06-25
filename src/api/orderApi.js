import api from './axios'

export const getOrders = (status = null) => {
  const params = status ? { status } : {}
  return api.get('/orders', { params })
}

export const getOrder = (id) => {
  return api.get(`/orders/${id}`)
}

export const createOrder = (data) => {
  return api.post('/orders', data)
}

export const updateOrderStatus = (id, status) => {
  return api.patch(`/orders/${id}/status`, { status })
}

export const deleteOrder = (id) => {
  return api.delete(`/orders/${id}`)
}