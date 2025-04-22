import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { ChevronLeft, ChevronRight, Pen, ShoppingCart, Star, Trash } from "lucide-react"
import AddProductModal from "./modals/AddProductModal"
import { DeleteModal } from "./modals/DeleteModal"
import { supprimerProduit } from "../lib/api"
import { useProducts } from "../context/ProductContext"
import CustomToast from "./CustomToast"

const ProductCard = ({ product }) => {
    const {
        nom,
        prix,
        description,
        stock,
        categories = [],
        images = [],
        createdAt,
        updatedAt,
        reviews = [],
        vente = [],
    } = product || {}

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const { setProducts } = useProducts()
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date)
    }
    // console.log("Produit", product)
    const averageRating = reviews.length ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0

    const truncateDescription = (text, maxLength = 100) => {
        if (!text) return ""
        if (text.length <= maxLength) return text
        return text.slice(0, maxLength) + "..."
    }

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    }
    const getImageSrc = () => {
        if (images.length > 0) {
            return images[currentImageIndex]
        }
        return "/noimage.jpg?height=300&width=300"
    }

    const handleDelete = async (productId) => {
        try {
            await supprimerProduit(productId)
            setProducts(prevProducts =>
                prevProducts.filter(product => product._id !== productId)
            )
            CustomToast("success", "Produit supprimé avec succès")
        } catch (error) {
            CustomToast("error", "Erreur lors de la suppression du produit")
        }
    }

    return (
        <Card className="h-full overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                    src={getImageSrc() || "noimage.jpg"}
                    alt={nom || "Product"}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                />
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1 opacity-70 hover:opacity-100"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-5 w-5" />
                            <span className="sr-only">Previous image</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1 opacity-70 hover:opacity-100"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-5 w-5" />
                            <span className="sr-only">Next image</span>
                        </Button>

                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? "bg-primary" : "bg-primary/30"}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <span className="sr-only">Image {index + 1}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute left-2 top-2">
                    <Badge variant={stock > 0 ? "default" : "destructive"} className={stock < 10 ? `bg-destructive` : stock == 10 ? `bg-orange-400` : 'bg-green-400'}>
                        {stock > 0 ? `En stock: ${stock}` : "Rupture de stock"}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 pb-0">
                {categories.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                        {categories.map((category, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {category.nom}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{nom || "Produit sans nom"}</h3>
                    <div className="text-lg font-bold">{prix?.toLocaleString("fr-FR")} MAD</div>
                </div>
                {reviews.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= Math.round(averageRating) ? "fill-primary text-primary" : "fill-muted text-muted"
                                        }`}
                                />
                            ))}
                        </div>
                        <span>({reviews.length})</span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground">{truncateDescription(description)}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                    {createdAt && <p>Ajouté le {formatDate(createdAt)}</p>}
                </div>
            </CardContent>

            <CardFooter className="w-full flex flex-col gap-2">
                <AddProductModal use={"max"} mode="edit" product={product} />
                <DeleteModal use="max" supprimerFun={() => handleDelete(product._id)} />
            </CardFooter>
        </Card>
    )
}


const ProductGrid = ({ products = [] }) => {
    if (!products || products.length === 0) {
        return (
            <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">Aucun produit disponible</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
            ))}
        </div>
    )
}

export default ProductGrid