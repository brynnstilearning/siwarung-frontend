import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, Loader2, ImageOff, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMenuItems } from '../../api/menuApi'
import { getCategories } from '../../api/categoryApi'
import { getTables } from '../../api/tableApi'
import { createOrder } from '../../api/orderApi'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/AnimatedSection'
import { MenuCardSkeleton } from '../../components/Skeleton'

const formatRupiah = (price) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)

export default function NewOrder() {
  const navigate = useNavigate()

  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [tables, setTables] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  const [cart, setCart] = useState([])
  const [tableId, setTableId] = useState('')
  const [type, setType] = useState('dine_in')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [menuRes, catRes, tableRes] = await Promise.all([
          getMenuItems(),
          getCategories(),
          getTables(),
        ])
        setMenuItems(menuRes.data.data)
        setCategories(catRes.data.data)
        setTables(tableRes.data.data)
      } catch (err) {
        console.error('Gagal memuat data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredMenu = activeCategory
    ? menuItems.filter((m) => m.category_id === activeCategory)
    : menuItems

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menu_item_id === item.id)
      if (existing) {
        return prev.map((c) =>
          c.menu_item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      return [...prev, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1, note: '' }]
    })
  }

  const updateQty = (menu_item_id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.menu_item_id === menu_item_id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    )
  }

  const removeFromCart = (menu_item_id) => {
    setCart((prev) => prev.filter((c) => c.menu_item_id !== menu_item_id))
  }

  const updateNote = (menu_item_id, note) => {
    setCart((prev) =>
      prev.map((c) => (c.menu_item_id === menu_item_id ? { ...c, note } : c))
    )
  }

  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0)

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setError('Pilih minimal satu menu.')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      await createOrder({
        table_id: tableId || null,
        type,
        items: cart.map((c) => ({
          menu_item_id: c.menu_item_id,
          quantity: c.quantity,
          note: c.note || '',
        })),
      })
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pesanan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3E8] flex flex-col">
        <div className="bg-[#1F2D24] px-6 h-[92px] flex items-center">
          <div className="w-full max-w-7xl mx-auto flex items-center gap-4">
            <ArrowLeft className="w-5 h-5 text-[#F7F3E8]/30" />
            <h1 className="font-display text-[#F7F3E8] text-lg font-semibold">Pesanan Baru</h1>
          </div>
        </div>
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex gap-6">
          <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array(6).fill(0).map((_, i) => <MenuCardSkeleton key={i} />)}
          </div>
          <div className="w-80 shrink-0">
            <div className="bg-white rounded-xl border border-[#1F2D24]/8 h-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3E8] flex flex-col">
      <div className="bg-[#1F2D24] px-6 h-[92px] flex items-center">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-4">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/orders')}
            className="text-[#F7F3E8]/60 hover:text-[#F7F3E8] transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="font-display text-[#F7F3E8] text-lg font-semibold">Pesanan Baru</h1>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex gap-6">
        {/* Left: Menu picker */}
        <div className="flex-1 min-w-0">
          <FadeIn className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(null)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
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
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-[#1F2D24] text-[#F7F3E8]'
                    : 'bg-white text-[#1F2D24]/60 border border-[#1F2D24]/10 hover:border-[#1F2D24]/25'
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredMenu.map((item) => {
                const inCart = cart.find((c) => c.menu_item_id === item.id)
                const isUnavailable = !item.is_available
                return (
                  <StaggerItem key={item.id}>
                    <motion.button
                      layout
                      whileHover={!isUnavailable ? { y: -4, boxShadow: '0 12px 28px rgba(31,45,36,0.1)' } : {}}
                      whileTap={!isUnavailable ? { scale: 0.97 } : {}}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      onClick={() => !isUnavailable && addToCart(item)}
                      disabled={isUnavailable}
                      className={`w-full bg-white rounded-xl border text-left overflow-hidden transition ${
                        isUnavailable
                          ? 'opacity-50 cursor-not-allowed border-[#1F2D24]/8'
                          : inCart
                          ? 'border-[#D98E2B] shadow-sm'
                          : 'border-[#1F2D24]/8 hover:border-[#1F2D24]/20'
                      }`}
                    >
                      <div className="aspect-[4/3] bg-[#1F2D24]/5 relative overflow-hidden">
                        {item.image ? (
                          <img
                            src={`http://127.0.0.1:8000/storage/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-6 h-6 text-[#1F2D24]/20" />
                          </div>
                        )}
                        <AnimatePresence>
                          {inCart && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#D98E2B] text-[#1F2D24] text-[10px] font-bold flex items-center justify-center"
                            >
                              {inCart.quantity}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[#D98E2B] font-medium uppercase tracking-wide mb-0.5">
                          {item.category?.name}
                        </p>
                        <p className="text-[#1F2D24] text-sm font-semibold leading-snug line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[#1F2D24] text-sm font-bold mt-1 tabular-nums">
                          {formatRupiah(item.price)}
                        </p>
                      </div>
                    </motion.button>
                  </StaggerItem>
                )
              })}
            </AnimatePresence>
          </StaggerContainer>
        </div>

        {/* Right: Cart */}
        <div className="w-80 shrink-0 flex flex-col">
          <FadeIn delay={0.1} className="flex flex-col h-full">
          <div className="bg-white rounded-xl border border-[#1F2D24]/8 flex flex-col h-full">
            <div className="p-4 border-b border-[#1F2D24]/8">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-4 h-4 text-[#1F2D24]/50" />
                <span className="text-sm font-semibold text-[#1F2D24]">
                  Keranjang {totalItems > 0 && `(${totalItems})`}
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setType('dine_in')}
                  className={`flex-1 text-xs py-2 rounded-lg font-medium transition ${
                    type === 'dine_in'
                      ? 'bg-[#1F2D24] text-[#F7F3E8]'
                      : 'bg-[#F7F3E8] text-[#1F2D24]/60'
                  }`}
                >
                  Makan di sini
                </button>
                <button
                  onClick={() => setType('takeaway')}
                  className={`flex-1 text-xs py-2 rounded-lg font-medium transition ${
                    type === 'takeaway'
                      ? 'bg-[#1F2D24] text-[#F7F3E8]'
                      : 'bg-[#F7F3E8] text-[#1F2D24]/60'
                  }`}
                >
                  Bawa pulang
                </button>
              </div>

              {type === 'dine_in' && (
                <select
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[#1F2D24]/15 bg-[#F7F3E8] text-[#1F2D24] outline-none focus:border-[#D98E2B] transition"
                >
                  <option value="">Pilih meja (opsional)</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Meja {t.number} ({t.capacity} orang)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-center text-[#1F2D24]/40 text-sm py-8">
                  Belum ada item dipilih
                </p>
              ) : (
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.menu_item_id}
                      layout
                      initial={{ opacity: 0, x: 12, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 12, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1F2D24] leading-snug line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#1F2D24]/50 tabular-nums">
                            {formatRupiah(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQty(item.menu_item_id, -1)}
                            className="w-6 h-6 rounded-full bg-[#F7F3E8] text-[#1F2D24] flex items-center justify-center hover:bg-[#1F2D24]/10 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="text-sm font-semibold text-[#1F2D24] w-4 text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQty(item.menu_item_id, 1)}
                            className="w-6 h-6 rounded-full bg-[#F7F3E8] text-[#1F2D24] flex items-center justify-center hover:bg-[#1F2D24]/10 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => removeFromCart(item.menu_item_id)}
                            className="w-6 h-6 rounded-full text-[#8C2F1E]/50 hover:text-[#8C2F1E] hover:bg-[#8C2F1E]/10 flex items-center justify-center transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Catatan (opsional)"
                        value={item.note}
                        onChange={(e) => updateNote(item.menu_item_id, e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#1F2D24]/10 bg-[#F7F3E8] text-[#1F2D24] placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] transition"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="p-4 border-t border-[#1F2D24]/8">
              {error && (
                <p className="text-xs text-[#8C2F1E] mb-3">{error}</p>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#1F2D24]/60">Total</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={totalPrice}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="font-display text-lg font-bold text-[#1F2D24] tabular-nums"
                  >
                    {formatRupiah(totalPrice)}
                  </motion.span>
                </AnimatePresence>
              </div>
              <motion.button
                whileHover={{ scale: cart.length === 0 ? 1 : 1.02 }}
                whileTap={{ scale: cart.length === 0 ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={submitting || cart.length === 0}
                className="w-full bg-[#D98E2B] text-[#1F2D24] text-sm font-semibold py-3 rounded-xl hover:bg-[#D98E2B]/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Buat Pesanan'
                )}
              </motion.button>
            </div>
          </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}