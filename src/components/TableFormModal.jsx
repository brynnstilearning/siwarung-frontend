import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createTable, updateTable } from '../api/tableApi'

export default function TableFormModal({ isOpen, onClose, onSuccess, editTable }) {
  const isEditMode = !!editTable

  const [form, setForm] = useState({
    number: '',
    capacity: 4,
    status: 'available',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editTable) {
      setForm({
        number: editTable.number,
        capacity: editTable.capacity,
        status: editTable.status,
      })
    } else {
      setForm({ number: '', capacity: 4, status: 'available' })
    }
    setErrors({})
  }, [editTable, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      if (isEditMode) {
        await updateTable(editTable.id, form)
      } else {
        await createTable({ number: form.number, capacity: form.capacity })
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
      <div className="bg-[#F7F3E8] rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2D24]/10">
          <h2 className="text-lg font-semibold text-[#1F2D24]">
            {isEditMode ? 'Edit Meja' : 'Tambah Meja Baru'}
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

          <div>
            <label htmlFor="number" className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5">
              Nomor meja
            </label>
            <input
              id="number"
              name="number"
              type="text"
              required
              value={form.number}
              onChange={handleChange}
              placeholder="Contoh: 01, A1, VIP-1"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
            />
            {errors.number && (
              <p className="mt-1 text-xs text-[#8C2F1E]">{errors.number[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="capacity" className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5">
              Kapasitas (orang)
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              required
              value={form.capacity}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
            />
          </div>

          {isEditMode && (
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
              >
                <option value="available">Tersedia</option>
                <option value="occupied">Terisi</option>
                <option value="reserved">Dipesan</option>
              </select>
            </div>
          )}

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
              'Tambah meja'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}