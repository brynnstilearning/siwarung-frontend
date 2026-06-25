import { useState, useEffect } from 'react'
import { ShoppingBag, Wallet, Clock, UtensilsCrossed, Loader2, TrendingUp } from 'lucide-react'
import api from '../../api/axios'

const formatRupiah = (price) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard')
        setData(res.data.data)
      } catch (err) {
        console.error('Gagal memuat dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3E8] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#1F2D24]/40 animate-spin" />
      </div>
    )
  }

  const stats = [
    {
      label: 'Order Hari Ini',
      value: data?.total_orders_today ?? 0,
      icon: ShoppingBag,
      color: 'bg-[#D98E2B]/10 text-[#D98E2B]',
      format: (v) => v,
    },
    {
      label: 'Omzet Hari Ini',
      value: data?.revenue_today ?? 0,
      icon: Wallet,
      color: 'bg-[#4A6741]/10 text-[#4A6741]',
      format: (v) => formatRupiah(v),
    },
    {
      label: 'Menunggu Proses',
      value: data?.pending_orders ?? 0,
      icon: Clock,
      color: 'bg-blue-50 text-blue-600',
      format: (v) => v,
    },
    {
      label: 'Total Menu',
      value: data?.total_menu_items ?? 0,
      icon: UtensilsCrossed,
      color: 'bg-[#8C2F1E]/10 text-[#8C2F1E]',
      format: (v) => v,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7F3E8]">
      <div className="bg-[#1F2D24] px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-[#F7F3E8] text-xl font-semibold">Dashboard</h1>
          <p className="text-[#F7F3E8]/50 text-sm mt-0.5">
            Ringkasan aktivitas warung hari ini
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-[#1F2D24]/8 p-5"
            >
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-[#1F2D24]/50 text-xs mb-1">{stat.label}</p>
              <p className="text-[#1F2D24] text-xl font-bold">
                {stat.format(stat.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Top menus */}
        <div className="bg-white rounded-xl border border-[#1F2D24]/8 p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-[#D98E2B]" />
            <h2 className="text-[#1F2D24] font-semibold text-sm">Menu Terlaris</h2>
          </div>

          {data?.top_menus?.length === 0 ? (
            <p className="text-[#1F2D24]/40 text-sm text-center py-8">
              Belum ada data penjualan.
            </p>
          ) : (
            <div className="space-y-3">
              {data?.top_menus?.map((item, index) => {
                const maxQty = data.top_menus[0]?.total_qty ?? 1
                const pct = Math.round((item.total_qty / maxQty) * 100)
                return (
                  <div key={item.menu_item_id} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-[#1F2D24]/30 w-4 shrink-0">
                      {index + 1}
                    </span>
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#1F2D24]/5 shrink-0">
                      {item.menu_item?.image ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${item.menu_item.image}`}
                          alt={item.menu_item?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UtensilsCrossed className="w-3 h-3 text-[#1F2D24]/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-[#1F2D24] truncate">
                          {item.menu_item?.name}
                        </p>
                        <span className="text-xs font-semibold text-[#1F2D24]/60 shrink-0 ml-2">
                          {item.total_qty}x
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#1F2D24]/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D98E2B] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}