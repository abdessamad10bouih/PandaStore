import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel"
import ProductCard from "./ProductCard"
import { useProducts } from "../../context/ProductContext"
import { Link } from "react-router-dom"

export default function NouveauxproductsCarousel() {
  const [api, setApi] = useState(null)
  const [current, setCurrent] = useState(0)
  const { products } = useProducts()
  console.log("products", products)
  useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])
  const activeProducts = products.filter((produit) => produit.status === 'active')
  return (
    <div className="relative p-8 overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Nos Nouveaux produits</h2>
        <Link to="/produits" className="text-blue-500 hover:underline">
          Voir tous les produits
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeProducts.slice(0, 4).map((produit) => (
          <ProductCard key={produit._id} product={produit} className="w-full h-full" />
        ))}
      </div>
    </div>
  )
}
