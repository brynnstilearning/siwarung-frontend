import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, Loader2, ImageOff, ArrowLeft } from 'lucide-react'
import { getMenuItems } from '../../api/menuApi'
import { getCategories } from '../../api/categoryApi'
import { getTables } from '../../api/tableApi'
import { createOrder } from '../../api/orderApi'

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
      <div className="min-h-screen bg-[#F7F3E8] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#1F2D24]/40 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3E8] flex flex-col">
      <div className="bg-[#1F2D24] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="text-[#F7F3E8]/60 hover:text-[#F7F3E8] transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[#F7F3E8] text-lg font-semibold">Pesanan Baru</h1>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex gap-6">
        {/* Left: Menu picker */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
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
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-[#1F2D24] text-[#F7F3E8]'
                    : 'bg-white text-[#1F2D24]/60 border border-[#1F2D24]/10 hover:border-[#1F2D24]/25'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredMenu.map((item) => {
              const inCart = cart.find((c) => c.menu_item_id === item.id)
              const isUnavailable = !item.is_available
              return (
                <button
                  key={item.id}
                  onClick={() => !isUnavailable && addToCart(item)}
                  disabled={isUnavailable}
                  className={`bg-white rounded-xl border text-left overflow-hidden transition ${
                    isUnavailable
                      ? 'opacity-50 cursor-not-allowed border-[#1F2D24]/8'
                      : inCart
                      ? 'border-[#D98E2B] shadow-sm'
                      : 'border-[#1F2D24]/8 hover:shadow-md hover:border-[#1F2D24]/20'
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
                    {inCart && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#D98E2B] text-[#1F2D24] text-[10px] font-bold flex items-center justify-center">
                        {inCart.quantity}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#D98E2B] font-medium uppercase tracking-wide mb-0.5">
                      {item.category?.name}
                    </p>
                    <p className="text-[#1F2D24] text-sm font-semibold leading-snug line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[#1F2D24] text-sm font-bold mt-1">
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Cart */}
        <div className="w-80 shrink-0 flex flex-col">
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
                cart.map((item) => (
                  <div key={item.menu_item_id} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1F2D24] leading-snug line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#1F2D24]/50">
                          {formatRupiah(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateQty(item.menu_item_id, -1)}
                          className="w-6 h-6 rounded-full bg-[#F7F3E8] text-[#1F2D24] flex items-center justify-center hover:bg-[#1F2D24]/10 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold text-[#1F2D24] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.menu_item_id, 1)}
                          className="w-6 h-6 rounded-full bg-[#F7F3E8] text-[#1F2D24] flex items-center justify-center hover:bg-[#1F2D24]/10 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.menu_item_id)}
                          className="w-6 h-6 rounded-full text-[#8C2F1E]/50 hover:text-[#8C2F1E] hover:bg-[#8C2F1E]/10 flex items-center justify-center transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Catatan (opsional)"
                      value={item.note}
                      onChange={(e) => updateNote(item.menu_item_id, e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#1F2D24]/10 bg-[#F7F3E8] text-[#1F2D24] placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] transition"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[#1F2D24]/8">
              {error && (
                <p className="text-xs text-[#8C2F1E] mb-3">{error}</p>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#1F2D24]/60">Total</span>
                <span className="text-lg font-bold text-[#1F2D24]">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
              <button
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}