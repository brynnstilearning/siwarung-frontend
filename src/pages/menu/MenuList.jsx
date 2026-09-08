import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ImageOff, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMenuItems, deleteMenuItem } from '../../api/menuApi'
import { getCategories } from '../../api/categoryApi'
import MenuFormModal from '../../components/MenuFormModal'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/AnimatedSection'
import { MenuCardSkeleton } from '../../components/Skeleton'

const formatRupiah = (price) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)

export default function MenuList() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [menuRes, catRes] = await Promise.all([
        getMenuItems(activeCategory),
        getCategories(),
      ])
      setMenuItems(menuRes.data.data)
      setCategories(catRes.data.data)
    } catch (err) {
      console.error('Gagal memuat data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeCategory])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus menu "${name}"?`)) return
    setDeletingId(id)
    try {
      await deleteMenuItem(id)
      setMenuItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      alert('Gagal menghapus menu.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3E8]">
      <div className="bg-[#1F2D24] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <FadeIn>
            <div>
              <h1 className="text-[#F7F3E8] text-xl font-semibold">Daftar Menu</h1>
              <p className="text-[#F7F3E8]/50 text-sm mt-0.5">
                Kelola menu makanan dan minuman warungmu
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setEditingItem(null); setModalOpen(true) }}
              className="flex items-center gap-2 bg-[#D98E2B] text-[#1F2D24] text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#D98E2B]/90 transition"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Tambah Menu
            </motion.button>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Category filter */}
        <FadeIn className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeCategory === null
                ? 'bg-[#1F2D24] text-[#F7F3E8]'
                : 'bg-white text-[#1F2D24]/60 border border-[#1F2D24]/10 hover:border-[#1F2D24]/25'
            }`}
          >
            Semua
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-[#1F2D24] text-[#F7F3E8]'
                  : 'bg-white text-[#1F2D24]/60 border border-[#1F2D24]/10 hover:border-[#1F2D24]/25'
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </FadeIn>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <MenuCardSkeleton key={i} />)}
          </div>
        ) : menuItems.length === 0 ? (
          <FadeIn className="text-center py-24">
            <p className="text-[#1F2D24]/50 text-sm">Belum ada menu di kategori ini.</p>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {menuItems.map((item) => (
                <StaggerItem key={item.id}>
                  <motion.div
                    layout
                    whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(31,45,36,0.12)' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="bg-white rounded-xl overflow-hidden border border-[#1F2D24]/8 group cursor-default"
                  >
                    <div className="aspect-[4/3] bg-[#1F2D24]/5 relative overflow-hidden">
                      {item.image ? (
                        <motion.img
                          src={`http://127.0.0.1:8000/storage/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff className="w-8 h-8 text-[#1F2D24]/20" />
                        </div>
                      )}
                      {!item.is_available && (
                        <div className="absolute top-3 left-3 bg-[#8C2F1E] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                          Habis
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-[#D98E2B] text-xs font-medium uppercase tracking-wide mb-1">
                        {item.category?.name}
                      </p>
                      <h3 className="text-[#1F2D24] font-semibold leading-snug mb-1">
                        {item.name}
                      </h3>
                      <p className="text-[#1F2D24]/50 text-xs leading-relaxed mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#1F2D24] font-semibold">
                          {formatRupiah(item.price)}
                        </span>
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setEditingItem(item); setModalOpen(true) }}
                            className="p-2 rounded-lg text-[#1F2D24]/50 hover:bg-[#1F2D24]/5 hover:text-[#1F2D24] transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(item.id, item.name)}
                            disabled={deletingId === item.id}
                            className="p-2 rounded-lg text-[#1F2D24]/50 hover:bg-[#8C2F1E]/10 hover:text-[#8C2F1E] transition disabled:opacity-40"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </AnimatePresence>
          </StaggerContainer>
        )}
      </div>

      <MenuFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        categories={categories}
        editItem={editingItem}
      />
    </div>
  )
}