import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UtensilsCrossed, Loader2 } from 'lucide-react'
import { loginUser } from '../../api/authApi'
import useAuthStore from '../../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginUser(form)
      setAuth(res.data.user, res.data.token)
      navigate('/menu')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Gagal masuk. Periksa email dan kata sandi.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#F7F3E8]">
      {/* Left: signboard panel */}
      <div className="hidden lg:flex lg:w-[44%] relative bg-[#1F2D24] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #F7F3E8 0px, #F7F3E8 1px, transparent 1px, transparent 14px)',
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D98E2B] flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-[#1F2D24]" strokeWidth={2.5} />
            </div>
            <span className="text-[#F7F3E8] font-semibold tracking-wide text-sm uppercase">
              SiWarung
            </span>
          </div>

          <div>
            <h1 className="font-[Georgia] text-[#F7F3E8] text-5xl leading-[1.05] tracking-tight">
              Buka warung,
              <br />
              <span className="text-[#D98E2B]">tutup buku</span>
              <br />
              kapan saja.
            </h1>
            <p className="mt-6 text-[#F7F3E8]/60 text-base max-w-sm leading-relaxed">
              Catat pesanan, pantau stok, dan lihat omzet harian warungmu —
              semua dari satu tempat.
            </p>
          </div>

          <p className="text-[#F7F3E8]/40 text-xs">
            &copy; {new Date().getFullYear()} SiWarung. Dibuat untuk UMKM F&amp;B Indonesia.
          </p>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-full bg-[#D98E2B] flex items-center justify-center">
              <UtensilsCrossed className="w-4.5 h-4.5 text-[#1F2D24]" strokeWidth={2.5} />
            </div>
            <span className="text-[#1F2D24] font-semibold tracking-wide text-sm uppercase">
              SiWarung
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-[#1F2D24] mb-1">
            Masuk ke akun
          </h2>
          <p className="text-sm text-[#1F2D24]/55 mb-8">
            Masukkan email dan kata sandi untuk melanjutkan.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-[#8C2F1E]/10 border border-[#8C2F1E]/20 text-[#8C2F1E] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="nama@warungmu.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5"
              >
                Kata sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-11 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F2D24]/40 hover:text-[#1F2D24]/70 transition"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#1F2D24] text-[#F7F3E8] text-sm font-medium py-2.5 rounded-lg hover:bg-[#1F2D24]/90 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#1F2D24]/55">
            Belum punya akun?{' '}
            <Link to="/register" className="text-[#D98E2B] font-medium hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}