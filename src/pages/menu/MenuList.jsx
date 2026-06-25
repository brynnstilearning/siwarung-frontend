import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ImageOff, Loader2 } from 'lucide-react'
import { getMenuItems, deleteMenuItem } from '../../api/menuApi'
import { getCategories } from '../../api/categoryApi'
import MenuFormModal from '../../components/MenuFormModal'

const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus menu "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return

    setDeletingId(id)
    try {
      await deleteMenuItem(id)
      setMenuItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      alert('Gagal menghapus menu. Coba lagi.')
    } finally {
      setDeletingId(null)
    }
  }

  const openAddModal = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F7F3E8]">
      {/* Header */}
      <div className="bg-[#1F2D24] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-[#F7F3E8] text-xl font-semibold">Daftar Menu</h1>
            <p className="text-[#F7F3E8]/50 text-sm mt-0.5">
              Kelola menu makanan dan minuman warungmu
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#D98E2B] text-[#1F2D24] text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#D98E2B]/90 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Tambah Menu
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeCategory === null
                ? 'bg-[#1F2D24] text-[#F7F3E8]'
                : 'bg-white text-[#1F2D24]/60 border border-[#1F2D24]/10 hover:border-[#1F2D24]/25'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-[#1F2D24] text-[#F7F3E8]'
                  : 'bg-white text-[#1F2D24]/60 border border-[#1F2D24]/10 hover:border-[#1F2D24]/25'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 text-[#1F2D24]/40 animate-spin" />
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#1F2D24]/50 text-sm">
              Belum ada menu di kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden border border-[#1F2D24]/8 hover:shadow-md transition group"
              >
                <div className="aspect-[4/3] bg-[#1F2D24]/5 relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
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
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg text-[#1F2D24]/50 hover:bg-[#1F2D24]/5 hover:text-[#1F2D24] transition"
                        aria-label="Edit menu"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={deletingId === item.id}
                        className="p-2 rounded-lg text-[#1F2D24]/50 hover:bg-[#8C2F1E]/10 hover:text-[#8C2F1E] transition disabled:opacity-40"
                        aria-label="Hapus menu"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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