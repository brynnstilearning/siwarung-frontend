import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/AnimatedSection'
import { CategoryCardSkeleton } from '../../components/Skeleton'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data.data ?? res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openAdd = () => {
    setEditTarget(null)
    setForm({ name: '' })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditTarget(cat)
    setForm({ name: cat.name })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditTarget(null)
    setForm({ name: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSubmitting(true)
    try {
      if (editTarget) {
        await updateCategory(editTarget.id, form)
      } else {
        await createCategory(form)
      }
      await fetchCategories()
      closeModal()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id)
      await fetchCategories()
      setDeleteConfirm(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <FadeIn>
          <div>
            <h1 className="text-xl font-semibold text-[#1F2D24]">Kategori Menu</h1>
            <p className="text-sm text-gray-500 mt-0.5">Kelola kategori untuk pengelompokan menu</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#D98E2B] text-white text-sm font-medium rounded-lg hover:bg-[#c07a20] transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </motion.button>
        </FadeIn>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <CategoryCardSkeleton key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <FadeIn className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
          <Tag className="w-10 h-10 opacity-30" />
          <p className="text-sm">Belum ada kategori. Tambahkan sekarang!</p>
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <motion.div
                  layout
                  whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(31,45,36,0.08)' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#D98E2B]/10 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-[#D98E2B]" />
                    </div>
                    <span className="text-sm font-medium text-[#1F2D24]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEdit(cat)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1F2D24] transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeleteConfirm(cat)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#8C2F1E] transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerContainer>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
            >
              <h2 className="text-base font-semibold text-[#1F2D24] mb-4">
                {editTarget ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ name: e.target.value })}
                    placeholder="Contoh: Makanan, Minuman, Snack"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D98E2B]/40 focus:border-[#D98E2B]"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#D98E2B] rounded-lg hover:bg-[#c07a20] transition disabled:opacity-60"
                  >
                    {submitting ? 'Menyimpan...' : editTarget ? 'Simpan' : 'Tambah'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
            >
              <h2 className="text-base font-semibold text-[#1F2D24] mb-2">Hapus Kategori?</h2>
              <p className="text-sm text-gray-500 mb-5">
                Kategori <span className="font-medium text-[#1F2D24]">"{deleteConfirm.name}"</span> akan dihapus permanen.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#8C2F1E] rounded-lg hover:bg-[#7a2819] transition"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}