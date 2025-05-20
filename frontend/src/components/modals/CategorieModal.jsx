

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, CirclePlus, Loader2, Pencil, Upload, X } from "lucide-react"

import { Button } from "../../components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Checkbox } from "../../components/ui/checkbox"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../../components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { cn } from "../../lib/utils"
import { ajouterCategorie, modifierCategorie } from "../../lib/api"
import { useProducts } from "../../context/ProductContext"
import CustomToast from "../CustomToast"

const CategoryModal = ({ mode = "add", categorie = [], initialData = {} }) => {
    // console.log("categorie : ", categorie)
    const [formData, setFormData] = useState({
        nom: categorie.nom || "",
        description: categorie.description || "",
        parentId: categorie.parentId || null,
        image: categorie.image || null,
    })
    const [isSubcategory, setIsSubcategory] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    // const [inputView, setInputView] = useState(false)

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                nom: categorie.nom || "",
                description: categorie.description || "",
                parentId: categorie.parentId || null,
                image: categorie.image || null,
            })
            setIsSubcategory(!!initialData.parentId)
            if (categorie.image) {
                setImagePreview(categorie.image)
            }
        } else {
            setFormData({
                nom: "",
                description: "",
                parentId: null,
                image: null,
            })
            setIsSubcategory(false)
            setImagePreview(null)
        }
    }, [])

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            handleChange("image", file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
        }))
        setImagePreview(null)
    }

    const [open, setOpen] = useState(false)
    const { categories, setCategories } = useProducts()

    console.log("Form Data : ", formData)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const formDataToSend = new FormData()
        formDataToSend.append("nom", formData.nom)
        formDataToSend.append("description", formData.description)
        if (formData.parentId) {
            formDataToSend.append("parentId", formData.parentId)
        }

        if (formData.image instanceof File) {
            formDataToSend.append("image", formData.image)
        } else if (typeof formData.image === "string" && formData.image.startsWith("http")) {
            formDataToSend.append("existingImage", formData.image)
        }


        try {
            const res = mode === "edit"
                ? await modifierCategorie(categorie._id, formDataToSend)
                : await ajouterCategorie(formDataToSend)
            // console.log("results : ", res.data)
            setIsLoading(false)
            setOpen(false)
            setCategories((prev) =>
                prev
                    .map((cat) => {
                        if (cat._id === formData.parentId) {
                            return {
                                ...cat,
                                subcategories: [...(cat.subcategories || []), res.data.categorie],
                            }
                        }
                        return cat
                    })
                    .concat(formData.parentId ? [] : [res.data.categorie]),
            )

            CustomToast("success", res.data.message || "Success")
            setFormData({
                nom: "",
                description: "",
                parentId: null,
                image: null,
            })
            setImagePreview(null)
        } catch (error) {
            console.log("Error ajouter Categorie", error)
            CustomToast("error", error.response.data.message || "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {mode === "edit" ? (
                    <Button variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                    </Button>
                ) : (
                    <Button>
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Ajouter Categorie
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Modifier la catégorie" : "Ajouter une catégorie"}</DialogTitle>
                    <DialogDescription>
                        {mode === "edit"
                            ? "Modifiez les détails de la catégorie ci-dessous."
                            : "Remplissez les informations pour créer une nouvelle catégorie."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="nom" className="text-sm font-medium">
                                Nom
                            </label>
                            <Input
                                id="nom"
                                value={formData.nom}
                                onChange={(e) => handleChange("nom", e.target.value)}
                                placeholder="Nom de la catégorie"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Description de la catégorie"
                            />
                        </div>
                        {!isSubcategory && (
                            <div className="grid gap-2">
                                <label htmlFor="image" className="text-sm font-medium">
                                    Image
                                </label>
                                <div className="flex flex-col gap-3">
                                    {imagePreview ? (
                                        <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                                            <img
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="Category preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                                onClick={removeImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="image-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="font-medium">Cliquez pour télécharger</span> ou glissez-déposez
                                                </p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF jusqu'à 10MB</p>
                                            </div>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        )}


                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isSubcategory"
                                checked={isSubcategory}
                                onCheckedChange={(checked) => {
                                    setIsSubcategory(checked)
                                    if (!checked) {
                                        setFormData((prev) => ({ ...prev, parentId: null }))
                                    }
                                }}
                            />
                            <label
                                htmlFor="isSubcategory"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                C'est une sous-catégorie
                            </label>
                        </div>

                        {isSubcategory && (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Catégorie parente</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="justify-between</Button>">
                                            {formData.parentId
                                                ? categories.find((cat) => cat._id === formData.parentId)?.nom
                                                : "Sélectionner une catégorie"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 pointer-events-auto">
                                        <Command>
                                            <CommandInput placeholder="Rechercher une catégorie..." />
                                            <CommandList>
                                                <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                                                <CommandGroup>
                                                    {categories.map((cat) => (
                                                        <CommandItem
                                                            key={cat._id}
                                                            value={cat._id}
                                                            onSelect={() => {
                                                                handleChange("parentId", cat._id)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.parentId === cat._id ? "opacity-100" : "opacity-0",
                                                                )}
                                                            />
                                                            {cat.nom}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === "edit" ? "Enregistrement..." : "Ajout..."}
                                </>
                            ) : (
                                mode === "edit" ? "Enregistrer les modifications" : "Ajouter"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CategoryModal
