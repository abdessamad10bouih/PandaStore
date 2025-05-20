import { Badge } from '../../ui/badge'
import { Card, CardContent } from '../../ui/card'
import React from 'react'
import { Link } from 'react-router-dom'

const CategoriesCard = ({ categorie }) => {
  const href = `/categories/${categorie._id}`;
  return (
    <Link to={href} className="block h-full transition-all duration-300 hover:scale-[1.02]">
      <Card className="overflow-hidden h-full border-0 shadow-md group">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={categorie.image || "/placeholder.svg?height=300&width=400"}
            alt={categorie.nom}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <CardContent className="relative -mt-16 bg-gradient-to-t from-white via-white to-transparent p-4">
          <div className="flex items-end justify-between">
            <h3 className="text-lg font-semibold line-clamp-1 text-gray-900">{categorie.nom}</h3>
            <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
              {categorie.produits.length} {categorie.produits.length === 1 ? "produit" : "produits"}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {categorie.description || `Découvrez notre collection de ${categorie.nom.toLowerCase()}`}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default CategoriesCard