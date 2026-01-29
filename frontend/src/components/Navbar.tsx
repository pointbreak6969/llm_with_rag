"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
const Navbar = () => {
    const router = useRouter();
    return (
          <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center space-x-2">
            <Image src="/logo.jpg" alt="jassaiPass Logo" width={32} height={32} />
            <span className="text-2xl font-bold text-foreground">jassaiPass</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 ml-auto mr-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition">Pricing</Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition">FAQ</Link  >
          </div>
          <div className="ml-auto">
            <Button onClick={() => router.push("/login")}>Try jassaiPass</Button>
          </div>
        </div>
      </nav>

    )
}

export default Navbar;