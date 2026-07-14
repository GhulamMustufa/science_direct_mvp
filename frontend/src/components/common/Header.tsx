import Link from "next/link";
import Image from "next/image";
import { Navbar } from "./Navbar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 py-2">
          <div className="relative h-12 w-48">
            <Image 
              src="/images/ijbahr-logo.png" 
              alt="IJBAHR Logo" 
              fill
              className="object-contain object-left" 
              priority
            />
          </div>
        </Link>
        <Navbar />
      </div>
    </header>
  );
}
