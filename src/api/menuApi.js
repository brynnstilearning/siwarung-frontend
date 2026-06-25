import api from './axios'

export const getMenuItems = (categoryId = null) => {
  const params = categoryId ? { category_id: categoryId } : {}
  return api.get('/menu-items', { params })
}

export const createMenuItem = (formData) => {
  return api.post('/menu-items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updateMenuItem = (id, formData) => {
  formData.append('_method', 'PUT')
  return api.post(`/menu-items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteMenuItem = (id) => {
  return api.delete(`/menu-items/${id}`)
}