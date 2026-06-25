import api from './axios'

export const getTables = () => {
  return api.get('/tables')
}

export const createTable = (data) => {
  return api.post('/tables', data)
}

export const updateTable = (id, data) => {
  return api.put(`/tables/${id}`, data)
}

export const deleteTable = (id) => {
  return api.delete(`/tables/${id}`)
}

export const getTableQrImageUrl = (id) => {
  return `http://127.0.0.1:8000/api/tables/${id}/qr-image`
}