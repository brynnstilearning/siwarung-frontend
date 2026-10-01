import { useState, useEffect } from 'react'
import { Plus, Loader2, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getOrders, updateOrderStatus, deleteOrder } from '../../api/orderApi'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/AnimatedSection'
import { OrderCardSkeleton } from '../../components/Skeleton'

const formatRupiah = (price) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)

const statusConfig = {
  pending: { label: 'Menunggu', color: 'bg-[#D98E2B]/15 text-[#D98E2B]', next: 'processing', nextLabel: 'Proses' },
  processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700', next: 'completed', nextLabel: 'Selesai' },
  completed: { label: 'Selesai', color: 'bg-[#4A6741]/15 text-[#4A6741]', next: null, nextLabel: null },
  cancelled: { label: 'Dibatalkan', color: 'bg-[#8C2F1E]/15 text-[#8C2F1E]', next: null, nextLabel: null },
}

const tabs = [
  { key: null, label: 'Semua' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'processing', label: 'Diproses' },
  { key: 'completed', label: 'Selesai' },
  { key: 'cancelled', label: 'Dibatalkan' },
]

export default function OrderList() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await getOrders(activeTab)
      setOrders(res.data.data)
    } catch (err) {
      console.error('Gagal memuat order:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await updateOrderStatus(id, status)
      fetchOrders()
    } catch (err) {
      alert('Gagal update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCancel = async (order) => {
    if (!window.confirm(`Batalkan pesanan ${order.order_code}?`)) return
    setUpdatingId(order.id)
    try {
      await updateOrderStatus(order.id, 'cancelled')
      fetchOrders()
    } catch (err) {
      alert('Gagal membatalkan pesanan.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3E8]">
      <div className="bg-[#1F2D24] px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <FadeIn>
            <div>
              <h1 className="font-display text-[#F7F3E8] text-2xl font-semibold">Daftar Pesanan</h1>
              <p className="text-[#F7F3E8]/50 text-sm mt-0.5">Kelola dan pantau semua pesanan masuk</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/orders/new')}
              className="flex items-center gap-2 bg-[#D98E2B] text-[#1F2D24] text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#D98E2B]/90 transition"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Pesanan Baru
            </motion.button>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <FadeIn className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <motion.button
              key={String(tab.key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.key
                  ? 'bg-[#1F2D24] text-[#F7F3E8]'
                  : 'bg-white text-[#1F2D24]/60 border border-[#1F2D24]/10 hover:border-[#1F2D24]/25'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </FadeIn>

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array(4).fill(0).map((_, i) => <OrderCardSkeleton key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <FadeIn className="text-center py-24">
            <p className="text-[#1F2D24]/50 text-sm">Belum ada pesanan.</p>
          </FadeIn>
        ) : (
          <StaggerContainer className="flex flex-col gap-3">
            <AnimatePresence>
              {orders.map((order) => {
                const cfg = statusConfig[order.status]
                return (
                  <StaggerItem key={order.id}>
                    <motion.div
                      layout
                      exit={{ opacity: 0, scale: 0.96 }}
                      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(31,45,36,0.08)' }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="bg-white rounded-xl border border-[#1F2D24]/8 p-5"
                    >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="font-semibold text-[#1F2D24] font-mono text-sm">
                          {order.order_code}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-[10px] text-[#1F2D24]/40 bg-[#1F2D24]/5 px-2 py-0.5 rounded-full">
                          {order.type === 'dine_in' ? 'Makan di sini' : 'Bawa pulang'}
                        </span>
                      </div>
                      {order.table && (
                        <p className="text-xs text-[#1F2D24]/50 mb-2">
                          Meja {order.table.number}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {order.items.map((item) => (
                          <span
                            key={item.id}
                            className="text-xs bg-[#F7F3E8] text-[#1F2D24]/70 px-2.5 py-1 rounded-lg"
                          >
                            {item.quantity}× {item.menu_item?.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-[#1F2D24] tabular-nums">
                        {formatRupiah(order.total_price)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 items-end shrink-0">
                      {cfg.next && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, cfg.next)}
                          disabled={updatingId === order.id}
                          className="flex items-center gap-1.5 text-xs font-medium bg-[#1F2D24] text-[#F7F3E8] px-3 py-2 rounded-lg hover:bg-[#1F2D24]/90 disabled:opacity-50 transition"
                        >
                          {updatingId === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                          {cfg.nextLabel}
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(order)}
                          disabled={updatingId === order.id}
                          className="text-xs font-medium text-[#8C2F1E] hover:underline disabled:opacity-50 transition"
                        >
                          Batalkan
                        </button>
                      )}
                        </div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </AnimatePresence>
          </StaggerContainer>
        )}
      </div>
    </div>
  )
}