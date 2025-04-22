import { useState } from "react"
import Navbar from "../components/Navbar"
import AppSideBar from "../components/AppSideBar"
import { supprimerProduit } from "../lib/api"
import { useAuth } from "../context/useAuth"
import ProductsTable from "../components/TableProducts"
import AddProductModal from "../components/modals/AddProductModal"
import { Button } from "../components/ui/button"
import { Grid, LoaderCircle, Table2 } from "lucide-react"
import ProductGrid from "../components/ProductGridView"
import { toast } from "sonner"
import { useProducts } from "../context/ProductContext"
import Layout from "../Layout/Layout"
import CustomToast from "../components/CustomToast"

const ProductDashboard = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true)
    const { products, setProducts, isLoading } = useProducts();
    const { user } = useAuth()
    const [view, setView] = useState('table')

    const handleSidebarChange = (expanded) => {
        setSidebarExpanded(expanded)
    }

    const changeView = () => {
        setView(prevView => prevView === 'table' ? 'grid' : 'table')
    }

    const handleAddProduct = (newProduct) => {
        setProducts([newProduct, ...products])
    }

    const handleDeleteProduct = async (deletedProductId) => {
        try {
            await supprimerProduit(deletedProductId)
            setProducts(prevProducts =>
                prevProducts.filter(product => product._id !== deletedProductId)
            )
            CustomToast("success", "Produit supprimé avec succès")
        } catch (error) {
            console.error('Error while deleting product: ', error)
            toast.error("Impossible de supprimer le produit")
        }
    }


    return (
        <Layout>
            <div className="w-full flex px-4 justify-between h-10 items-center mt-4">
                <h1 className="text-2xl font-bold">Liste des Produits</h1>
                <div className="flex items-center gap-3">
                    <AddProductModal onProductAdded={handleAddProduct} />
                    <Button variant="outline" size="icon" onClick={changeView}>
                        {view === 'table' ? <Grid /> : <Table2 />}
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <LoaderCircle className="transition-all animate-spin" />
                    </div>
                ) : (
                    view === 'table' ? (
                        <ProductsTable
                            onDeleteProduct={handleDeleteProduct}
                        />
                    ) : (
                        <ProductGrid products={products} />
                    )
                )}
            </div>
        </Layout>
    )
}

export default ProductDashboard