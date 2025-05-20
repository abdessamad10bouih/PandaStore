import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel"
import { useProducts } from "../../context/ProductContext"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import OfferTimer from "./OfferTimer"

// Sample posts data structure (replace with your actual data)
// const posts = [
//     { id: 1, titre: "Welcome to Our Store", description: "Discover the best products just for you!" },
//     { id: 2, titre: "New Arrivals", description: "Check out our latest collection of premium items" },
//     { id: 3, titre: "Special Offers", description: "Limited time deals you don't want to miss" },
// ]

export default function HeroSection() {
    const [api, setApi] = useState(null)
    const [current, setCurrent] = useState(0)
    const { posts } = useProducts()
    const limitedPosts = posts.slice(-3)
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
    // console.log('posts', posts)
    return (
        <div className="relative overflow-x-hidden">
            <Carousel className="w-full h-[55vh] relative" setApi={setApi}>
                <CarouselContent className="h-[55vh]">
                    {limitedPosts.map((post, index) => (
                        <CarouselItem key={post.id} className="h-full">
                            <div className="relative w-full h-full">
                                <div className="absolute inset-0 z-0">
                                    <img src={post.image || `/prem-kits-1-min.jpg`} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-500 opacity-80 z-10"></div>

                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="flex flex-col items-center justify-center text-white text-center px-4 md:px-8 max-w-4xl">
                                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{post.titre}</h1>
                                        <p className="text-sm md:text-base lg:text-lg mt-2 md:mt-4 max-w-full ">{post.contenu}</p>
                                        <div className="mt-4 flex gap-2">
                                            <Link to={`/posts/${post._id}`} >
                                                <Button variant="outline" className="bg-white text-blue-900 hover:bg-blue-100 transition duration-200">
                                                    Voir les détails
                                                </Button>
                                            </Link>
                                            <Link to={`/products/${post.id}`}>
                                                <Button variant="outline" className="bg-blue-900 hover:bg-blue-100 transition duration-200">
                                                    Acheter maintenant
                                                </Button>
                                            </Link>
                                        </div>
                                        <OfferTimer endDateString={post.dateFin} className="mt-4 bg-transparent" />
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className="absolute inset-y-0 left-2 flex items-center z-30">
                    <CarouselPrevious className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <div className="absolute inset-y-0 right-2 flex items-center z-30">
                    <CarouselNext className="h-8 w-8 md:h-10 md:w-10" />
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
                    {limitedPosts.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${current === index ? "bg-white scale-125" : "bg-white/50"
                                }`}
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </Carousel>
        </div>
    )
}
