import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, ImageIcon, X, Info, Package, Calendar, Pen, CirclePlus, Loader2 } from "lucide-react"

import { Button } from "../ui/button"
import { Calendar as CalendarComponent } from "../ui/calendar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { cn } from "../../lib/utils"
import { Avatar, AvatarImage } from "../ui/avatar"
import { MultiSelect } from "../side UI/MultipleSelect"
import { Card, CardContent } from "../ui/card"
import { useProducts } from "../../context/ProductContext"
import { ajouterPost, modifierPost } from "../../lib/api"
import CustomToast from "../CustomToast"
import DatePickerBtn from "../side UI/DatePickerBtn"

export default function PostsModal({ mode = "add", post = {} }) {
    const fileInputRef = useRef(null)
    const isEditing = mode === "edit"
    const { products, setPosts } = useProducts()
    const [activeTab, setActiveTab] = useState("general")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const parseInitialDate = (dateString) => {
        if (!dateString) return undefined
        return new Date(dateString)
    }
    const [formData, setFormData] = useState({
        titre: post.titre || "",
        contenu: post.contenu || "",
        type: post.type || "promotion",
        produits: Array.isArray(post.produits)
            ? post.produits.map(p => typeof p === "string" ? p : p._id)
            : [],
        image: post.image || "",
        dateDebut: parseInitialDate(post.dateDebut),
        dateFin: parseInitialDate(post.dateFin),
        status: post.status || "actif",
        imageFile: post.image || null,
    })


    console.log('post : ', post, 'formData : ', formData)
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDateChange = (name, date) => {
        setFormData((prev) => ({
            ...prev,
            [name]: date,
        }))
    }

    const handleImageClick = () => {
        fileInputRef.current.click()
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Create a preview URL for the image
        const imagePreview = URL.createObjectURL(file)

        setFormData((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview,
            image: file.name, // Store the filename
        }))
    }

    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            imageFile: null,
            imagePreview: "",
            image: "",
        }))

        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleRemoveProduct = (productId) => {
        setFormData((prev) => ({
            ...prev,
            produits: prev.produits.filter((id) => id !== productId),
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const form = new FormData()
        form.append("titre", formData.titre)
        form.append("contenu", formData.contenu)
        form.append("type", formData.type)
        form.append("status", formData.status)
        form.append("dateDebut", formData.dateDebut ? format(formData.dateDebut, "yyyy-MM-dd") : "")
        form.append("dateFin", formData.dateFin ? format(formData.dateFin, "yyyy-MM-dd") : "")
        form.append("produits", JSON.stringify(formData.produits));
        if (formData.imageFile) {
            form.append("image", formData.imageFile)
        }
        // console.log("Form data to be submitted:", form)
        try {
            if (isEditing) {
                const res = await modifierPost(post._id, form);
                console.log("Post modifié avec succès :", res);
                CustomToast("success", res.data.message || "Post modifié avec succès");
                setPosts((prev) =>
                    prev.map((p) => (p._id === post._id ? res.data.post : p))
                );
            } else {
                const res = await ajouterPost(form);
                console.log("Post ajouté avec succès :", res);
                CustomToast("success", res.data.message || "Post ajouté avec succès");
                setPosts((prev) => [res.data.post, ...prev]);
            }
            setOpen(false)
            setLoading(false)
        } catch (error) {
            console.error("Erreur lors de l'ajout ou modification du post :", error)
            // CustomToast("error", error.response?.data?.message || "Erreur lors de l'ajout du post")
        } finally {
            setLoading(false)
        }
    }

    const productOptions = products.map((product) => ({
        value: product._id,
        label: product.nom,
        image: product.images[0] || "/noimage.jpg",
    }))

    const selectedProductIds = formData.produits.map((p) =>
        typeof p === "string" ? p : p.value
    );

    const selectedProducts = products.filter((product) =>
        selectedProductIds.includes(product._id)
    );


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditing ?
                    <Button variant="ghost" className="bg-card/10 text-card w-[40%]">
                        <Pen />
                        Modifier Post
                    </Button>
                    :
                    <Button>
                        <CirclePlus />
                        Ajouter Post
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gérer la promotion</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-4 w-full">
                            <TabsTrigger value="general" className="flex items-center gap-1">
                                <Info className="h-4 w-4" />
                                <span className="hidden sm:inline">Général</span>
                            </TabsTrigger>
                            <TabsTrigger value="products" className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                <span className="hidden sm:inline">Produits</span>
                            </TabsTrigger>
                            <TabsTrigger value="dates" className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span className="hidden sm:inline">Dates</span>
                            </TabsTrigger>
                            <TabsTrigger value="media" className="flex items-center gap-1">
                                <ImageIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Média</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* General Tab */}
                        <TabsContent value="general" className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="titre">Titre</Label>
                                    <Input
                                        id="titre"
                                        name="titre"
                                        value={formData.titre}
                                        onChange={handleChange}
                                        placeholder="Titre de la promotion"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="contenu">Contenu</Label>
                                    <Textarea
                                        id="contenu"
                                        name="contenu"
                                        value={formData.contenu}
                                        onChange={handleChange}
                                        placeholder="Description de la promotion"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nouveau_produit">Nouveau Produit</SelectItem>
                                            <SelectItem value="promotion">Promotion</SelectItem>
                                            <SelectItem value="offre_speciale">Offre Spéciale</SelectItem>
                                            <SelectItem value="autre">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="status">Statut</Label>
                                    <RadioGroup
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange("status", value)}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="actif" id="actif" />
                                            <Label htmlFor="actif">Actif</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="inactif" id="inactif" />
                                            <Label htmlFor="inactif">Inactif</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className="flex justify-between mt-4">
                                <Button type="button" variant="outline" onClick={() => setActiveTab("products")}>
                                    Suivant
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="products" className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="produits">Sélectionner des produits</Label>
                                    <MultiSelect
                                        options={productOptions}
                                        selected={formData.produits}
                                        onChange={(values) => handleSelectChange("produits", values)}
                                        placeholder="Sélectionner produits"
                                        emptyMessage="Aucun produit trouvé"
                                    />
                                </div>

                                {formData.produits.length > 0 && (
                                    <div className="mt-6">
                                        <Label>Produits sélectionnés ({formData.produits.length})</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                            {selectedProducts.map((product) => (
                                                <Card key={product._id} className="overflow-hidden">
                                                    <CardContent className="p-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-10 w-10 rounded-sm">
                                                                <AvatarImage
                                                                    src={product.images[0] || "/noimage.jpg"}
                                                                    alt={product.nom}
                                                                    className="object-cover"
                                                                />
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{product.nom}</p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={() => handleRemoveProduct(product._id)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between mt-4">
                                <Button type="button" variant="outline" onClick={() => setActiveTab("general")}>
                                    Précédent
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setActiveTab("dates")}>
                                    Suivant
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="dates" className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="dateDebut">Date de début</Label>
                                    <DatePickerBtn
                                        date={formData.dateDebut}
                                        handleDateChange={(date) => handleSelectChange("dateDebut", date)}
                                    />

                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="dateFin">Date de fin</Label>
                                    <DatePickerBtn
                                        date={formData.dateFin}
                                        handleDateChange={(date) => handleSelectChange("dateFin", date)}
                                    />

                                </div>
                            </div>

                            <div className="flex justify-between mt-4">
                                <Button type="button" variant="outline" onClick={() => setActiveTab("products")}>
                                    Précédent
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setActiveTab("media")}>
                                    Suivant
                                </Button>
                            </div>
                        </TabsContent>

                        {/* Media Tab */}
                        <TabsContent value="media" className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Image de promotion</Label>
                                    <div className="flex flex-col items-center gap-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        {formData.imagePreview || formData.image ? (
                                            <div className="relative h-40 w-full rounded-md overflow-hidden border">
                                                <img
                                                    src={formData.imagePreview || formData.image || "/placeholder.svg"}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                                                >
                                                    <X className="h-4 w-4 text-white" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={handleImageClick}
                                                className="flex h-40 w-full cursor-pointer items-center justify-center rounded-md border border-dashed"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">Cliquez pour ajouter une image</span>
                                                </div>
                                            </div>
                                        )}

                                        <Button type="button" variant="outline" onClick={handleImageClick} className="w-full">
                                            {formData.image ? "Changer l'image" : "Ajouter une image"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-4">
                                <Button type="button" variant="outline" onClick={() => setActiveTab("dates")}>
                                    Précédent
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <> <Loader2 className="animate-spin" /> Chargement...</> : isEditing ? "Modifier" : "Ajouter"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
