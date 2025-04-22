import { useEffect, useState } from "react";
import {
    ChevronLeft,
    Edit,
    Trash2,
    Archive,
    Copy,
    MoreHorizontal,
    Package,
    DollarSign,
    Percent,
    Clock,
    ShoppingCart,
    Truck,
    AlertCircle,
    CheckCircle,
    XCircle,
    ImageIcon,
    List,
    FileText,
    Calendar,
    Plus,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import ProductModal from "../components/modals/AddProductModal";
import Navbar from "../components/Navbar";
import AppSideBar from "../components/AppSideBar";
import { useAuth } from "../context/useAuth";
import { useProducts } from "../context/ProductContext";
import { useParams } from "react-router-dom";
import { getProduit } from "../lib/api";
import Layout from "../Layout/Layout";

export default function AdminProductView() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const { user } = useAuth();
    const { categories, fournisseurs } = useProducts();
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const { id } = useParams();
    const { products, setProducts } = useProducts();
    const [product, setProduit] = useState(null);



    useEffect(() => {
        const getOneProduct = async () => {
            try {
                const res = await getProduit(id);
                console.log("Product fetched successfully:", res.data);
                setProducts(res.data);
                setProduit(res.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        getOneProduct();
    }, []);

    const handleSidebarChange = (expanded) => {
        setSidebarExpanded(expanded);
    };

    console.log("product : ", product)


    const defaultProduct = {
        _id: "67e9c3db3eec65674a701fb4",
        nom: "Camera Sony",
        description: "azertyuiop",
        prix: 2000,
        images: [],
        categories: ["cat1", "cat2"],
        stock: 5000,
        specifications: [{ nom: "Résolution", valeur: "4K" }],
        status: "active",
        cost: 104,
        profit: 123,
        discount: 50,
        fournisseur: "67e4798dbf92d2dd863b3f13",
        reviews: [],
        vente: [],
        createdAt: "2025-03-30T22:21:15.728+00:00",
        updatedAt: "2025-03-31T00:30:27.608+00:00",
        __v: 0,
    };

    const productData = product || defaultProduct;

    if (!productData) {
        return <div>Loading...</div>;
    }
    // Create a map of category IDs to names
    const categoryNameMap = categories.reduce((map, cat) => {
        map[cat._id] = cat.nom;
        return map;
    }, {});

    const profitMargin =
        productData.cost > 0 ? (((productData.prix - productData.cost) / productData.prix) * 100).toFixed(2) : 0;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const getStatusBadge = () => {
        switch (productData.status) {
            case "active":
                return <Badge className="bg-green-100 text-green-800 border-green-300">Actif</Badge>;
            case "inactive":
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Inactif</Badge>;
            case "outOfStock":
                return <Badge className="bg-red-100 text-red-800 border-red-300">Rupture de stock</Badge>;
            default:
                return <Badge className="bg-blue-100 text-blue-800 border-blue-300">{productData.status}</Badge>;
        }
    };
    const calculatedProfit = productData.prix - productData.cost;
    return (
        <Layout>
            <div className="w-full overflow-auto">
                <div className="p-2">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()} className="h-10">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>
                <div className="container mx-auto p-6 max-w-[1280px] overflow-auto">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
                        <div className="flex items-center gap-2">

                            <h1 className="text-xl font-bold sm:text-2xl">Détails du produit</h1>
                            {getStatusBadge()}
                        </div>

                        <div className="flex gap-2 items-center">
                            <ProductModal mode="edit" product={productData} />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Dupliquer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Archive className="mr-2 h-4 w-4" />
                                        Archiver
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl flex items-center justify-between">
                                        <span>Aperçu du produit</span>
                                        <Badge variant="outline" className="ml-2 font-normal">
                                            ID: {productData._id?.substring(0, 8)}...
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h2 className="text-2xl font-bold">{productData.nom}</h2>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {productData.categories?.map((category, index) => {
                                                        const categoryId = typeof category === 'object' ? category._id : category;
                                                        const categoryName = typeof category === 'object' ? category.nom : category;
                                                        const displayName = categoryNameMap[categoryId] || categoryName || categoryId;

                                                        return (
                                                            <Badge key={index} variant="outline">
                                                                {displayName}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                                                <p className="text-sm">{productData.description}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">Prix</div>
                                                    <div className="text-xl font-bold flex items-center">
                                                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                                                        {productData.prix?.toLocaleString()} MAD
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">Stock</div>
                                                    <div className="text-xl font-bold flex items-center">
                                                        <Package className="h-4 w-4 mr-1 text-gray-400" />
                                                        {productData.stock?.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">Coût</div>
                                                    <div className="text-lg font-medium flex items-center">
                                                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                                                        {productData.cost?.toLocaleString()} MAD
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">Profit</div>
                                                    <div className="text-lg font-medium flex items-center">
                                                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                                                        {calculatedProfit?.toLocaleString()} MAD
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">Remise</div>
                                                    <div className="text-lg font-medium flex items-center">
                                                        <Percent className="h-4 w-4 mr-1 text-gray-400" />
                                                        {productData.discount}%
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">Marge</div>
                                                    <div className="text-lg font-medium flex items-center">
                                                        <Percent className="h-4 w-4 mr-1 text-gray-400" />
                                                        {profitMargin}%
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <div className="text-sm text-gray-500 mb-1">Marge bénéficiaire</div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full"
                                                        style={{ width: `${Math.min(profitMargin, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                    <span>0%</span>
                                                    <span>{profitMargin}%</span>
                                                    <span>100%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-4 mb-4">
                                    <TabsTrigger value="overview" className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span className="hidden sm:inline">Détails</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="specifications" className="flex items-center gap-1">
                                        <List className="h-4 w-4" />
                                        <span className="hidden sm:inline">Spécifications</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="images" className="flex items-center gap-1">
                                        <ImageIcon className="h-4 w-4" />
                                        <span className="hidden sm:inline">Images</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="sales" className="flex items-center gap-1">
                                        <ShoppingCart className="h-4 w-4" />
                                        <span className="hidden sm:inline">Ventes</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Informations générales</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                                    <div className="mt-1 flex items-center">
                                                        {productData.status === "active" ? (
                                                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                                        )}
                                                        <span>{productData.status === "active" ? "Actif" : "Inactif"}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">Fournisseur</h3>
                                                    <div className="mt-1 flex items-center">
                                                        <Truck className="h-4 w-4 text-gray-400 mr-1" />
                                                        <span>{productData.fournisseur?.nom || "--"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Dates</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                        <div>
                                                            <div className="text-xs text-gray-500">Créé le</div>
                                                            <div className="text-sm">{formatDate(productData.createdAt)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                                        <div>
                                                            <div className="text-xs text-gray-500">Dernière mise à jour</div>
                                                            <div className="text-sm">{formatDate(productData.updatedAt)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="specifications">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Spécifications techniques</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {productData.specifications && productData.specifications.length > 0 ? (
                                                <div className="rounded-md border">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="px-4 py-3 text-left font-medium">Nom</th>
                                                                <th className="px-4 py-3 text-left font-medium">Valeur</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {productData.specifications?.map((spec, index) => (
                                                                <tr
                                                                    key={index}
                                                                    className={index !== productData.specifications.length - 1 ? "border-b" : ""}
                                                                >
                                                                    <td className="px-4 py-3">{spec.nom}</td>
                                                                    <td className="px-4 py-3">{spec.valeur}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                                    <p>Aucune spécification disponible</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="images">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Images du produit</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {productData.images && productData.images.length > 0 ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {productData.images?.map((image, index) => (
                                                        <div key={index} className="relative border rounded-md overflow-hidden aspect-square">
                                                            <img
                                                                src={image || "/placeholder.svg?height=200&width=200"}
                                                                alt={`${productData.nom} - image ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                                    <p>Aucune image disponible</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="sales">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Historique des ventes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {productData.vente && productData.vente.length > 0 ? (
                                                <div className="rounded-md border">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="px-4 py-3 text-left font-medium">Date</th>
                                                                <th className="px-4 py-3 text-left font-medium">Quantité</th>
                                                                <th className="px-4 py-3 text-left font-medium">Revenu</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {productData.vente?.map((sale, index) => (
                                                                <tr key={index} className={index !== productData.vente.length - 1 ? "border-b" : ""}>
                                                                    <td className="px-4 py-3">{formatDate(sale.date)}</td>
                                                                    <td className="px-4 py-3">{sale.quantity}</td>
                                                                    <td className="px-4 py-3">{(sale.quantity * productData.prix)?.toLocaleString()} MAD</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                                    <p>Aucune vente enregistrée</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statut du produit</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {productData.status === "active" ? (
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                            )}
                                            <span className="font-medium">
                                                {productData.status === "active" ? "Produit actif" : "Produit inactif"}
                                            </span>
                                        </div>
                                        {getStatusBadge()}
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Stock</span>
                                            <span className="font-medium">{productData.stock?.toLocaleString()}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Prix</span>
                                            <span className="font-medium">{productData.prix?.toLocaleString()} MAD</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Remise</span>
                                            <span className="font-medium">{productData.discount}%</span>
                                        </div>
                                    </div>

                                    <ProductModal mode="edit" product={productData} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations financières</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Coût</div>
                                            <div className="text-xl font-bold">{productData.cost?.toLocaleString()} MAD</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Profit</div>
                                            <div className="text-xl font-bold text-green-600">{productData.profit?.toLocaleString()} MAD</div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Marge bénéficiaire</div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-xl font-bold">{profitMargin}%</div>
                                            <Badge variant={Number.parseFloat(profitMargin) > 30 ? "success" : "warning"}>
                                                {Number.parseFloat(profitMargin) > 30 ? "Bonne marge" : "Marge faible"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full"
                                            style={{ width: `${Math.min(profitMargin, 100)}%` }}
                                        ></div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations système</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">ID</div>
                                        <div className="font-mono text-sm">{productData._id}</div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">Fournisseur Nom</div>
                                        <div className="font-mono text-sm">{productData.fournisseur?.nom || "--"}</div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">Créé le</div>
                                        <div className="text-sm">{formatDate(productData.createdAt)}</div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">Dernière modification</div>
                                        <div className="text-sm">{formatDate(productData.updatedAt)}</div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">Version</div>
                                        <div className="text-sm">{productData.__v}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
}