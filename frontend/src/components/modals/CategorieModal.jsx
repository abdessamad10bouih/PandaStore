import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, CirclePlus, Pencil } from "lucide-react"

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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { cn } from "../../lib/utils"
import { ajouterCategorie } from "../../lib/api"
import { toast } from "sonner"
import { useProducts } from "../../context/ProductContext"
import CustomToast from "../CustomToast"

const CategoryModal = ({ mode = "add", categorie = [], initialData = {} }) => {
    console.log("categorie : ", categorie)
    const [formData, setFormData] = useState({
        nom: categorie.nom || "",
        description: categorie.description || "",
        parentId: categorie.parentId || null
    })
    const [isSubcategory, setIsSubcategory] = useState(false)
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                nom: categorie.nom || "",
                description: categorie.description || "",
                parentId: categorie.parentId || null
            })
            // If parentId has a value, it's a subcategory
            setIsSubcategory(!!initialData.parentId)
        } else {
            setFormData({
                nom: "",
                description: "",
                parentId: null,
            })
            setIsSubcategory(false)
        }
    }, [])

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const [open, setOpen] = useState(false)
    const { categories, setCategories } = useProducts()


    console.log("Form Data : ", formData)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await ajouterCategorie(formData);
            console.log("results : ", res.data);
            setOpen(false)
            setCategories((prev) =>
                prev.map((cat) => {
                    if (cat._id === formData.parentId) {
                        return {
                            ...cat,
                            subcategories: [...(cat.subcategories || []), res.data.categorie],
                        }
                    }
                    return cat
                }).concat(formData.parentId ? [] : [res.data.categorie])
            )

            // toast.success(res.data.message || "hala madrid")
            CustomToast('success', res.data.message || "Success")
            setFormData({
                nom: "",
                description: "",
                parentId: null,
            })
        } catch (error) {
            console.log("Error ajouter Categorie", error);
            CustomToast("error", error.response.data.message || "error")

        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {mode === "edit" ?
                    <Button variant="outline">
                        <Pencil />
                        Modifier
                    </Button>
                    :
                    <Button>
                        <CirclePlus />
                        Ajouter Categorie
                    </Button>}
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
                                        <Button variant="outline" role="combobox" className="justify-between">
                                            {formData.parentId
                                                ? categories.find((cat) => cat._id === formData.parentId)?.nom
                                                : "Sélectionner une catégorie"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
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
                        <Button type="submit">{mode === "edit" ? "Enregistrer les modifications" : "Ajouter"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CategoryModal
