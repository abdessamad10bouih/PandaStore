"use client"

import { useState } from "react"
import { Eye, ChevronLeft, ChevronRight, ChevronRightIcon } from "lucide-react"
import AddProductModal from "./modals/AddProductModal"
import { supprimerProduit } from "../lib/api"
import { toast } from "sonner"
import { DeleteModal } from "./modals/DeleteModal"
import { useNavigate } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Badge } from "./ui/badge"
import CustomToast from "./CustomToast"

// Helper component for displaying categories and subcategories
function CategoryCell({ product }) {
    if (!product.categories || product.categories.length === 0) {
        return <span className="text-gray-500 text-sm">Aucune</span>
    }

    return (
        <div className="flex flex-wrap gap-1">
            {product.categories.map((category) => {
                // Check if this category has subcategories
                const hasSubcategories =
                    category.subcategories &&
                    category.subcategories.length > 0 &&
                    product.subcategories &&
                    product.subcategories.some((subId) => category.subcategories.some((sub) => sub._id === subId))

                // Find subcategories that belong to this category and are selected for this product
                const selectedSubcategories = hasSubcategories
                    ? category.subcategories.filter((sub) => product.subcategories && product.subcategories.includes(sub._id))
                    : []

                return (
                    <div key={category._id} className="flex items-center">
                        {selectedSubcategories.length > 0 ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge
                                            variant="outline"
                                            className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-default"
                                        >
                                            {category.nom}
                                            {selectedSubcategories.length > 0 && (
                                                <span className="ml-1 text-xs bg-purple-200 px-1 rounded-full">
                                                    {selectedSubcategories.length}
                                                </span>
                                            )}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white p-2 shadow-lg rounded-md border">
                                        <div className="text-xs font-medium mb-1">Sous-catégories:</div>
                                        <div className="flex flex-col gap-1">
                                            {selectedSubcategories.map((sub) => (
                                                <div key={sub._id} className="flex items-center text-xs">
                                                    <ChevronRightIcon className="h-3 w-3 mr-1" />
                                                    {sub.nom}
                                                </div>
                                            ))}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                {category.nom}
                            </Badge>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

const sampleProducts = []

export default function ProductsTable({ allProducts }) {
    const { products, setProducts } = useProducts() || sampleProducts

    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 5

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = Array.isArray(products) ? products.slice(indexOfFirstProduct, indexOfLastProduct) : []
    const totalPages = Math.ceil(products?.length / productsPerPage)
    const navigate = useNavigate()

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const handleDelete = async (productId) => {
        try {
            await supprimerProduit(productId)
            setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId))
            CustomToast("success", "Produit supprimé avec succès")
        } catch (error) {
            CustomToast("error", "Erreur lors de la suppression du produit")
        }
    }
    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 font-medium text-gray-900">Image</th>
                            <th className="px-4 py-3 font-medium text-gray-900">Nom</th>
                            <th className="px-4 py-3 font-medium text-gray-900">Prix</th>
                            <th className="px-4 py-3 font-medium text-gray-900">Catégorie</th>
                            <th className="px-4 py-3 font-medium text-gray-900">Stock</th>
                            <th className="px-4 py-3 font-medium text-gray-900">status</th>
                            <th className="px-4 py-3 font-medium text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <tr key={product._id || product.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <img
                                            src={
                                                Array.isArray(product.images) && product.images.length > 0
                                                    ? product.images[0]
                                                    : "https://cdn.vectorstock.com/i/500p/46/50/missing-picture-page-for-website-design-or-mobile-vector-27814650.jpg"
                                            }
                                            alt={product.nom}
                                            className="h-10 w-10 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{product.nom}</td>
                                    <td className="px-4 py-3 text-gray-700">{product.prix}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        <CategoryCell product={product} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10
                                                    ? "bg-green-100 text-green-800"
                                                    : product.stock > 5
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-yellow-800"
                                                }`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex space-x-2 items-center">
                                            <Eye
                                                className="h-4 w-4 text-blue-500 cursor-pointer"
                                                size={20}
                                                onClick={() => navigate(`/products/${product._id}`)}
                                            />
                                            <AddProductModal mode="edit" product={product} use="min" />
                                            <DeleteModal supprimerFun={() => handleDelete(product._id)} use="min" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <>
                                <tr>
                                    <td colSpan={7} className="text-center py-4 h-32">
                                        Aucun produit trouvé
                                    </td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>

            {products?.length > productsPerPage && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{indexOfFirstProduct + 1}</span> à{" "}
                        <span className="font-medium">{Math.min(indexOfLastProduct, products.length)}</span> sur{" "}
                        <span className="font-medium">{products.length}</span> produits
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className={`inline-flex items-center px-3 py-1 border rounded-md text-sm ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Précédent
                        </button>

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`inline-flex items-center px-3 py-1 border rounded-md text-sm ${currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Suivant
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
