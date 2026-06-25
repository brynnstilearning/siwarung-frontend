import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, Users, Download } from 'lucide-react'
import { getTables, deleteTable, getTableQrImageUrl } from '../../api/tableApi'
import TableFormModal from '../../components/TableFormModal'

const statusConfig = {
  available: { label: 'Tersedia', color: 'bg-[#4A6741] text-white' },
  occupied: { label: 'Terisi', color: 'bg-[#8C2F1E] text-white' },
  reserved: { label: 'Dipesan', color: 'bg-[#D98E2B] text-[#1F2D24]' },
}

export default function TableList() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTable, setEditingTable] = useState(null)

  const fetchTables = async () => {
    setLoading(true)
    try {
      const res = await getTables()
      setTables(res.data.data)
    } catch (err) {
      console.error('Gagal memuat data meja:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const handleDelete = async (id, number) => {
    if (!window.confirm(`Hapus meja "${number}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setDeletingId(id)
    try {
      await deleteTable(id)
      setTables((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      alert('Gagal menghapus meja. Coba lagi.')
    } finally {
      setDeletingId(null)
    }
  }

  const openAddModal = () => {
    setEditingTable(null)
    setModalOpen(true)
  }

  const openEditModal = (table) => {
    setEditingTable(table)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F7F3E8]">
      <div className="bg-[#1F2D24] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-[#F7F3E8] text-xl font-semibold">Manajemen Meja</h1>
            <p className="text-[#F7F3E8]/50 text-sm mt-0.5">Kelola meja dan kode QR untuk pemesanan mandiri</p>
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-[#D98E2B] text-[#1F2D24] text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#D98E2B]/90 transition">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Tambah Meja
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 text-[#1F2D24]/40 animate-spin" />
          </div>
        ) : tables.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#1F2D24]/50 text-sm">Belum ada meja. Tambahkan meja pertama.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tables.map((table) => (
              <div key={table.id} className="bg-white rounded-xl border border-[#1F2D24]/8 overflow-hidden hover:shadow-md transition">
                <div className="flex items-center justify-center bg-white p-6 border-b border-[#1F2D24]/8">
                  <img src={getTableQrImageUrl(table.id)} alt={`QR Code Meja ${table.number}`} className="w-32 h-32" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-[#1F2D24] font-semibold text-lg">Meja {table.number}</h3>
                      <div className="flex items-center gap-1 text-[#1F2D24]/50 text-xs mt-0.5">
                        <Users className="w-3 h-3" />
                        <span>{table.capacity} orang</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusConfig[table.status].color}`}>
                      {statusConfig[table.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <a href={getTableQrImageUrl(table.id)} download={`meja-${table.number}-qr.svg`} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#1F2D24]/70 border border-[#1F2D24]/15 rounded-lg py-2 hover:bg-[#1F2D24]/5 transition">
                      <Download className="w-3.5 h-3.5" />
                      Unduh QR
                    </a>
                    <button onClick={() => openEditModal(table)} className="p-2 rounded-lg text-[#1F2D24]/50 hover:bg-[#1F2D24]/5 hover:text-[#1F2D24] transition" aria-label="Edit meja">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(table.id, table.number)} disabled={deletingId === table.id} className="p-2 rounded-lg text-[#1F2D24]/50 hover:bg-[#8C2F1E]/10 hover:text-[#8C2F1E] transition disabled:opacity-40" aria-label="Hapus meja">
                      {deletingId === table.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TableFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchTables} editTable={editingTable} />
    </div>
  )
}
