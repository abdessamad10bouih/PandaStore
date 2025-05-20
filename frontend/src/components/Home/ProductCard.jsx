import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"

export default function ProductCard({ product }) {
    return (
        <Card className="h-full flex flex-col overflow-hidden">
            <div className="relative h-[50vh] aspect-square overflow-hidden">
                <img
                    src={
                        product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg?height=300&width=300"
                    }
                    alt={product.nom}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                />
                {product.discount > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
                )}
            </div>

            <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg line-clamp-1">{product.nom}</h3>
                    <span className="font-bold text-lg">{product.prix}MAD</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                    {product.categories &&
                        product.categories.map((categorie, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {categorie.nom}
                            </Badge>
                        ))}
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            </CardContent>

            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Button size="sm" className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ajouter
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Voir plus
                </Button>
            </CardFooter>
        </Card>
    )
}
