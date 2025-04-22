"use client"

import { useState, useEffect } from "react"
import { Heart, MenuIcon, Search, ShoppingCart, X } from "lucide-react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { Badge } from "../../components/ui/badge"

import Menu from "./Menu"
import DropDownUser from "./DropDownUser"
import { useAuth } from "../../context/useAuth"

const HomeNavbar = () => {
  const { user } = useAuth()
  const [showSearch, setShowSearch] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  // Example cart count - replace with your actual cart logic
  useEffect(() => {
    // Simulate cart items - replace with your actual cart state
    setCartItemCount(3)

    // Add scroll listener for navbar shadow effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full h-16 bg-card flex items-center p-2 justify-between md:justify-around transition-all duration-300 ${isScrolled ? "shadow-md" : "shadow border-b"}`}
      >
        <div className="flex items-center gap-4 md:gap-8">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <img src="main_logo.png" className="w-full" alt="logo" />
                <Menu className="flex flex-col space-y-3" />
                <div className="border-t pt-4">
                  <div className="w-full flex pl-2 rounded-lg border justify-center items-center">
                    <Search className="text-muted-foreground h-4 w-4" />
                    <Input className="shadow-none border-none" placeholder="Rechercher" />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center">
            <img src="main_logo.png" className="lg:w-[120px] w-[100px]" alt="logo" />
          </Link>

          <div className="hidden lg:flex">
            <Menu />
          </div>
        </div>

        {/* Middle section: Search bar (desktop only) */}
        <div className="w-[40%] h-full items-center justify-center hidden md:flex">
          <div className="w-full h-[80%] relative group">
            <div className="w-full h-full flex pl-3 rounded-lg border border-input bg-background hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all duration-200">
              <Search className="text-muted-foreground h-4 w-4 self-center" />
              <Input
                className="shadow-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Rechercher un produit..."
              />
            </div>
            <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-[70%]">
              Rechercher
            </Button>
          </div>
        </div>

        {/* Right section: Action icons and user menu */}
        <div className="flex items-center justify-end gap-1 sm:gap-3 md:gap-5">
          <Button variant="ghost" size="icon" className="relative md:hidden" onClick={() => setShowSearch(!showSearch)}>
            {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="relative hidden sm:flex">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Favorites</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItemCount}
              </Badge>
            )}
            <span className="sr-only">Shopping cart</span>
          </Button>

          {user ? (
            <DropDownUser />
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium hidden sm:block">
                Login
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden w-full flex items-center px-4 py-3 border-b"
          >
            <div className="w-full relative">
              <div className="w-full flex pl-3 rounded-lg border border-input">
                <Search className="text-muted-foreground h-4 w-4 self-center" />
                <Input
                  className="shadow-none border-none focus-visible:ring-0"
                  placeholder="Rechercher un produit..."
                />
              </div>
              <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-[70%]">
                Rechercher
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default HomeNavbar
