"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/items" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#FBD5D3]/80 bg-[#FFF9F8]/95 backdrop-blur-xl shadow-sm">
      <div className="container-custom flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href={makeLink("/")} className="relative block h-16 w-48 shrink-0 transition-transform hover:scale-105">
          <Image
            src="/logo.png"
            alt="Raj Biosis Private Limited"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={makeLink(link.path)}
              className="relative font-bold text-[#796565] transition-all duration-300 hover:text-[#E05353] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#E05353] after:transition-all after:duration-300 hover:after:w-full text-sm"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Button */}
        <div className="hidden lg:block">
          <Link href={makeLink("/contact")}>
            <button className="rounded-xl bg-[#E05353] px-6 py-3 font-bold text-white shadow-md shadow-[#E05353]/25 transition-all duration-300 hover:bg-[#C93B3B] hover:shadow-xl hover:shadow-[#E05353]/35 hover:-translate-y-0.5">
              Get Quote
            </button>
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          className="rounded-xl border border-[#FBD5D3] bg-[#FFF0EF] p-2.5 text-[#E05353] transition-all duration-300 hover:bg-[#FDE2E1] lg:hidden"
        >
          {menuOpen ? (
            <X size={24} className="text-[#E05353]" />
          ) : (
            <Menu size={24} className="text-[#E05353]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-[#FBD5D3] bg-[#FFF9F8] px-6 py-6 shadow-xl">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={makeLink(link.path)}
                onClick={() => setMenuOpen(false)}
                className="font-bold text-[#796565] transition-all duration-300 hover:translate-x-1 hover:text-[#E05353]"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href={makeLink("/contact")}
              onClick={() => setMenuOpen(false)}
            >
              <button className="mt-2 w-full rounded-xl bg-[#E05353] py-3.5 font-bold text-white shadow-md shadow-[#E05353]/25 transition-all duration-300 hover:bg-[#C93B3B]">
                Get Quote
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}