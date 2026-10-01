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
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import { logoutUser } from '../api/authApi'

const MotionNavLink = motion(NavLink)

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
      <div className="h-[92px] px-5 flex items-center border-b border-[#F7F3E8]/10">
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
          <MotionNavLink
            key={to}
            to={to}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'text-[#F7F3E8]'
                : 'text-[#F7F3E8]/50 hover:bg-[#F7F3E8]/5 hover:text-[#F7F3E8]/80'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-[#F7F3E8]/10 rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className={`w-4 h-4 shrink-0 relative z-10 ${isActive ? 'text-[#D98E2B]' : ''}`} />
                <span className="relative z-10">{label}</span>
              </>
            )}
          </MotionNavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-[#F7F3E8]/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-[#F7F3E8] text-sm font-medium truncate">{user?.name}</p>
          <p className="text-[#F7F3E8]/40 text-xs capitalize mt-0.5">{user?.role}</p>
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#F7F3E8]/50 hover:bg-[#8C2F1E]/20 hover:text-[#F7F3E8]/80 transition"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Keluar
        </motion.button>
      </div>
    </aside>
  )
}