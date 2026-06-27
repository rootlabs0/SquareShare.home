import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SquareShareLogo from "@/components/SquareShareLogo";
import Footer from "@/components/Footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Minimal top bar: no in-page anchors, just navigation home */}
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="Square Share home"
          >
            <SquareShareLogo width={26} height={26} className="text-white" />
            <span className="text-lg font-black uppercase tracking-tighter text-white">
              Square Share
            </span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-white/50 transition-colors duration-200 hover:text-acid"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to home
          </Link>
        </nav>
      </header>

      <main>{children}</main>

      <Footer />
    </div>
  );
}
