import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UtensilsCrossed, Loader2 } from 'lucide-react'
import { registerUser } from '../../api/authApi'
import useAuthStore from '../../store/authStore'

export default function Register() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const res = await registerUser(form)
      setAuth(res.data.user, res.data.token)
      navigate('/menu')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setErrors({ general: 'Terjadi kesalahan. Coba lagi nanti.' })
      }
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
              Warungmu,
              <br />
              <span className="text-[#D98E2B]">tertata rapi</span>
              <br />
              sejak hari pertama.
            </h1>
            <p className="mt-6 text-[#F7F3E8]/60 text-base max-w-sm leading-relaxed">
              Daftar sekarang dan mulai kelola menu, pesanan, dan laporan
              warungmu dalam hitungan menit.
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
            Buat akun baru
          </h2>
          <p className="text-sm text-[#1F2D24]/55 mb-8">
            Lengkapi data di bawah untuk mulai menggunakan SiWarung.
          </p>

          {errors.general && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-[#8C2F1E]/10 border border-[#8C2F1E]/20 text-[#8C2F1E] text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5"
              >
                Nama lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Nama kamu"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-[#8C2F1E]">{errors.name[0]}</p>
              )}
            </div>

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
              {errors.email && (
                <p className="mt-1 text-xs text-[#8C2F1E]">{errors.email[0]}</p>
              )}
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
                  placeholder="Minimal 6 karakter"
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
              {errors.password && (
                <p className="mt-1 text-xs text-[#8C2F1E]">{errors.password[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-xs font-medium text-[#1F2D24]/70 mb-1.5"
              >
                Konfirmasi kata sandi
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Ulangi kata sandi"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1F2D24]/15 bg-white text-[#1F2D24] text-sm placeholder:text-[#1F2D24]/30 outline-none focus:border-[#D98E2B] focus:ring-2 focus:ring-[#D98E2B]/20 transition"
              />
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
                'Daftar'
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#1F2D24]/55">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#D98E2B] font-medium hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}