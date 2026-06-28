import { NavLink, useNavigate } from 'react-router-dom'
import {
  UtensilsCrossed,
  LayoutDashboard,
  BookOpen,
  Table2,
  ClipboardList,
  LogOut,
  Tag,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import { logoutUser } from '../api/authApi'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/menu', icon: BookOpen, label: 'Menu' },
  { to: '/categories', icon: Tag, label: 'Kategori' },
  { to: '/tables', icon: Table2, label: 'Meja' },
  { to: '/orders', icon: ClipboardList, label: 'Pesanan' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (_) { }
    clearAuth()
    navigate('/login')
  }

  return (
    <aside className="w-56 shrink-0 bg-[#1F2D24] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#F7F3E8]/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#D98E2B] flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-4 h-4 text-[#1F2D24]" strokeWidth={2.5} />
          </div>
          <span className="text-[#F7F3E8] font-semibold tracking-wide text-sm uppercase">
            SiWarung
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                ? 'bg-[#F7F3E8]/10 text-[#F7F3E8]'
                : 'text-[#F7F3E8]/50 hover:bg-[#F7F3E8]/5 hover:text-[#F7F3E8]/80'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D98E2B]' : ''}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-[#F7F3E8]/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-[#F7F3E8] text-sm font-medium truncate">{user?.name}</p>
          <p className="text-[#F7F3E8]/40 text-xs capitalize mt-0.5">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#F7F3E8]/50 hover:bg-[#8C2F1E]/20 hover:text-[#F7F3E8]/80 transition"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  )
}