import { Link } from 'react-router-dom'

const Navbar = () => {
  const menu = [
    { label: 'Beranda', href: '/' },
    { label: 'Proker', href: '/proker' },
    { label: 'Blog', href: '/blog' },
    { label: 'Aspirasi', href: '/aspirasi' },
  ]
  
  return (
    <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-full border border-cream/15 bg-ink/75 px-2 py-2 shadow-2xl shadow-black/40 backdrop-blur-xl sm:px-4">
      <ul className="flex w-full items-center justify-between font-outfit text-[10px] font-medium text-cream/75 sm:justify-center sm:gap-1 sm:text-xs">
        {menu.slice(0,2).map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="relative block rounded-full px-2 py-2 transition hover:text-orange after:absolute after:bottom-1 after:left-2 after:right-2 after:h-px after:origin-left after:scale-x-0 after:bg-orange after:transition-transform hover:after:scale-x-100 sm:px-3"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="mx-1 shrink-0 sm:mx-3"><Link to="/" aria-label="Beranda"><img src="/osis.png" alt="Logo OSIS SMAN 1 Paciran" className="h-9 w-9 object-contain transition hover:scale-110 sm:h-10 sm:w-10" /></Link></li>
        {menu.slice(2,4).map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="relative block rounded-full px-2 py-2 transition hover:text-orange after:absolute after:bottom-1 after:left-2 after:right-2 after:h-px after:origin-left after:scale-x-0 after:bg-orange after:transition-transform hover:after:scale-x-100 sm:px-3"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar

