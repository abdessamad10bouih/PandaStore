

import { useState, useEffect } from "react"
import { Eye, ChevronLeft, ChevronRight, ChevronRightIcon, Search, SlidersHorizontal, X } from "lucide-react"
import AddProductModal from "./modals/AddProductModal"
import { supprimerProduit } from "../lib/api"
import { DeleteModal } from "./modals/DeleteModal"
import { useNavigate } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Badge } from "./ui/badge"
import CustomToast from "./CustomToast"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

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
  const { products, setProducts } = useProducts() || { products: sampleProducts, setProducts: () => { } }

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(10)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  // Filter products based on search term and filters
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.categories &&
          product.categories.some((cat) => cat.nom.toLowerCase().includes(searchTerm.toLowerCase())))

      const matchesStatus = statusFilter === "all" || product.status === statusFilter

      let matchesStock = true
      if (stockFilter === "low") {
        matchesStock = product.stock <= 5
      } else if (stockFilter === "medium") {
        matchesStock = product.stock > 5 && product.stock <= 20
      } else if (stockFilter === "high") {
        matchesStock = product.stock > 20
      }

      return matchesSearch && matchesStatus && matchesStock
    })
    : []

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const navigate = useNavigate()

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, stockFilter])

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
      console.log("Error deleting product:", error)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setStockFilter("all")
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className={isFiltersVisible ? "bg-gray-100" : ""}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtres
              {(statusFilter !== "all" || stockFilter !== "all") && (
                <span className="ml-1 w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-xs flex items-center justify-center">
                  {(statusFilter !== "all" ? 1 : 0) + (stockFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </Button>

            <Select value={productsPerPage.toString()} onValueChange={(value) => setProductsPerPage(Number(value))}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="10 par page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 par page</SelectItem>
                <SelectItem value="10">10 par page</SelectItem>
                <SelectItem value="20">20 par page</SelectItem>
                <SelectItem value="50">50 par page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFiltersVisible && (
          <div className="mt-4 flex flex-wrap gap-4 p-4 bg-gray-50 rounded-md">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tous les status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les status</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Stock</label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="low">Faible (≤ 5)</SelectItem>
                  <SelectItem value="medium">Moyen (6-20)</SelectItem>
                  <SelectItem value="high">Élevé (> 20)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Réinitialiser
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <TableRow key={product._id || product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img
                        src={
                          Array.isArray(product?.images) && product.images.length > 0
                            ? product?.images[0]
                            : "https://cdn.vectorstock.com/i/500p/46/50/missing-picture-page-for-website-design-or-mobile-vector-27814650.jpg"
                        }
                        alt={product.nom}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.nom}</TableCell>
                  <TableCell>{product.prix}</TableCell>
                  <TableCell>
                    <CategoryCell product={product} />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {product.status === "active" ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product._id}`)}>
                            <Button className="w-full text-left cursor-pointer" variant="outline" >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <div>
                              <AddProductModal mode="edit" product={product} use="max" />
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-red-600">
                            <div>
                              <DeleteModal supprimerFun={() => handleDelete(product._id)} use="max" />
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  {searchTerm || statusFilter !== "all" || stockFilter !== "all" ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-gray-500">Aucun produit ne correspond à votre recherche</p>
                      <Button variant="outline" size="sm" onClick={clearFilters}>
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun produit trouvé</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{indexOfFirstProduct + 1}</span> à{" "}
            <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> sur{" "}
            <span className="font-medium">{filteredProducts.length}</span> produits
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber
                if (totalPages <= 5) {
                  pageNumber = i + 1
                } else if (currentPage <= 3) {
                  pageNumber = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i
                } else {
                  pageNumber = currentPage - 2 + i
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
