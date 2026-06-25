import { useState, useEffect } from 'react'
import { X, Loader2, ImagePlus } from 'lucide-react'
import { createMenuItem, updateMenuItem } from '../api/menuApi'

export default function MenuFormModal({ isOpen, onClose, onSuccess, categories, editItem }) {
  const isEditMode = !!editItem

  const [form, setForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    is_available: true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editItem) {
      setForm({
        category_id: editItem.category_id,
        name: editItem.name,
        description: editItem.description || '',
        price: editItem.price,
        is_available: editItem.is_available,
      })
      setImagePreview(
        editItem.image ? `http://127.0.0.1:8000/storage/${editItem.image}` : null
      )
    } else {
      setForm({
        category_id: categories[0]?.id || '',
        name: '',
        description: '',
        price: '',
        is_available: true,
      })
      setImagePreview(null)
    }
    setImageFile(null)
    setErrors({})
  }, [editItem, isOpen, categories])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const formData = new FormData()
    formData.append('category_id', form.category_id)
    formData.append('name', form.name)
    formData.append('description', form.description || '')
    formData.append('price', form.price)
    formData.append('is_available', form.is_available ? 1 : 0)
    if (imageFile) formData.append('image', imageFile)

    try {
      if (isEditMode) {
        await updateMenuItem(editItem.id, formData)
      } else {
        await createMenuItem(formData)
      }
      onSuccess()
      onClose()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setErrors({ general: 'Terjadi kesalahan. Coba lagi.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2D24]/40 backdrop-blur-sm">
      <div className="bg-[#F7F3E8] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2D24]/10 sticky top-0 bg-[#F7F3E8]">
          <h2 className="text-lg font-semibold text-[#1F2D24]">
            {isEditMode ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#1F2D24]/50 hover:bg-[#1F2D24]/5 hover:text-[#1F2D24] transition"
            aria-label="Tutup"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="px-4 py-3 rounded-lg bg-[#8C2F1E]/10 border border-[#8C2F1E]/20 text-[#8C2F1E] text-sm">
              {errors.general}
            </div>
          )}

          {/* Image upload */}
          <div>
            <label className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5">
              Foto menu
            </label>
            <label className="flex items-center justify-center aspect-[4/3] rounded-lg border-2 border-dashed border-[#1F2D24]/15 bg-white cursor-pointer hover:border-[#D98E2B] transition overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[#1F2D24]/30">
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-xs">Klik untuk unggah foto</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category_id" className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5">
              Kategori
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              value={form.category_id}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-xs text-[#8C2F1E]">{errors.category_id[0]}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5">
              Nama menu
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Nasi Goreng Spesial"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-[#8C2F1E]">{errors.name[0]}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              value={form.description}
              onChange={handleChange}
              placeholder="Deskripsi singkat menu ini"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5">
              Harga (Rp)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              required
              value={form.price}
              onChange={handleChange}
              placeholder="25000"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-[#8C2F1E]">{errors.price[0]}</p>
            )}
          </div>

          {/* Availability */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="is_available"
              checked={form.is_available}
              onChange={handleChange}
              className="w-4 h-4 rounded border-[#1F2D24]/25 text-[#D98E2B] focus:ring-[#D98E2B]/30"
            />
            <span className="text-sm text-[#1F2D24]/80">Menu tersedia saat ini</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#1F2D24] text-[#F7F3E8] text-sm font-medium py-2.5 rounded-lg hover:bg-[#1F2D24]/90 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : isEditMode ? (
              'Simpan perubahan'
            ) : (
              'Tambah menu'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}