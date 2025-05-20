import { useState, useEffect } from "react"
import { X, Upload, User, Mail, Phone, MapPin, Check, AlertCircle, CirclePlus, Edit, Loader2Icon } from "lucide-react"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog"
import { Switch } from "../ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ajouterFournisseur, modifierFournisseur } from "../../lib/api"
import { toast } from "sonner"
import { useProducts } from "../../context/ProductContext"
import CustomToast from "../CustomToast"

export default function FournisseurModal({
    fournisseur,
    mode = "add",
}) {
    const isEditMode = mode === "edit"
    const [activeTab, setActiveTab] = useState("general")
    const [logoPreview, setLogoPreview] = useState(null)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setFournisseurs } = useProducts()
    const [formData, setFormData] = useState({
        id: "",
        nom: "",
        logo: "",
        email: "",
        tel: "",
        adresse: "",
        respo: "",
        status: "actif",
        siteweb: "",
        description: "",
        notes: "",
    })

    // Reset form when modal opens or fournisseur changes
    useEffect(() => {
        if (fournisseur && isEditMode) {
            setFormData(
                (prev) => ({
                    ...prev,
                    id: fournisseur._id,
                    nom: fournisseur.nom,
                    logo: fournisseur.logo,
                    email: fournisseur.contact?.email,
                    tel: fournisseur.contact?.tel,
                    adresse: fournisseur.contact?.adresse,
                    respo: fournisseur.contact?.respo,
                    status: fournisseur.status,
                    siteweb: fournisseur.siteweb || "",
                    description: fournisseur.description || "",
                    notes: fournisseur.notes || "",
                }),
            )
            if (fournisseur.logo) {
                setLogoPreview(fournisseur.logo)
            }
        } else {
            setFormData({
                id: "",
                nom: "",
                logo: "",
                email: "",
                tel: "",
                adresse: "",
                respo: "",
                status: "actif",
                siteweb: "",
                description: "",
                notes: "",
            })
            setLogoPreview(null)
        }
    }, [fournisseur, open, isEditMode])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleContactChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleStatusChange = (checked) => {
        setFormData((prev) => ({
            ...prev,
            status: checked ? "active" : "inactive",
        }))
    }

    // Handle logo upload
    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result)
                setFormData((prev) => ({ ...prev, logo: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const Data = {
            fournisseurId: isEditMode ? formData.id : '',
            nom: formData.nom,
            tel: formData.tel,
            email: formData.email,
            respo: formData.respo,
            logo: formData.logo,
            status: formData.status,
            description: formData.description,
            notes: formData.notes,
            adresse: formData.adresse,
            siteweb: formData.siteweb,
        };

        try {
            const res = isEditMode
                ? await modifierFournisseur(Data)
                : await ajouterFournisseur(Data);
            setOpen(false);
            setLoading(false);
            if (isEditMode) {
                setFournisseurs((prev) => prev.map((f) => (f._id === fournisseur._id ? res.data : f)));
                CustomToast("success", "Fournisseur modifié avec succès !")
            } else {
                setFournisseurs((prev) => [...prev, res.data]);
                CustomToast("error", "Fournisseur ajouté avec succès !")
            }
        } catch (error) {
            setLoading(false);
            console.log("error lors ajouter fournisseur :", error);
            toast.error(error.response?.data?.message || "Erreur");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditMode ?
                    <Button className="p-2 gap-4 w-full" variant="ghost">
                        <Edit className="text-gray-500" />
                        <span className="text-gray-800">
                            Modifier
                        </span>
                    </Button>
                    :
                    <Button>
                        <CirclePlus />
                        Ajouter Fournisseur
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="w-[768px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEditMode ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="general" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-2 mb-4 w-full">
                            <TabsTrigger value="general">Informations générales</TabsTrigger>
                            <TabsTrigger value="contact">Contact & Détails</TabsTrigger>
                        </TabsList>

                        {/* General Information Tab */}
                        <TabsContent value="general" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Logo Upload */}
                                <div className="space-y-2">
                                    <Label>Logo</Label>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview || "/placeholder.svg"}
                                                    alt="Logo preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center p-2">
                                                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                                    <span className="text-xs text-gray-500 mt-1 block">Aucun logo</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <input
                                                type="file"
                                                id="logo-upload"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                            />
                                            <Label
                                                htmlFor="logo-upload"
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Choisir un logo
                                            </Label>
                                            <p className="text-xs text-gray-500">Format recommandé: PNG, JPG. Taille max: 1MB</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nom">Nom du fournisseur *</Label>
                                        <Input
                                            id="nom"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            placeholder="Nom de l'entreprise"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="block">
                                            Statut
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="status" checked={formData.status === "actif"} onCheckedChange={handleStatusChange} />
                                            <Label htmlFor="status" className="cursor-pointer">
                                                {formData.status === "actif" ? (
                                                    <span className="text-green-600 flex items-center">
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Actif
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 flex items-center">
                                                        <X className="h-4 w-4 mr-1" />
                                                        Inactif
                                                    </span>
                                                )}
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    placeholder="Description du fournisseur"
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="siteweb">Site web</Label>
                                <Input
                                    id="siteweb"
                                    name="siteweb"
                                    type="text"
                                    value={formData.siteweb || ""}
                                    onChange={handleChange}
                                    placeholder="https://www.example.com"
                                />
                            </div>
                        </TabsContent>

                        {/* Contact Information Tab */}
                        <TabsContent value="contact" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                        Email *
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleContactChange}
                                        placeholder="contact@entreprise.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tel" className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                        Téléphone *
                                    </Label>
                                    <Input
                                        id="tel"
                                        name="tel"
                                        value={formData.tel}
                                        onChange={handleContactChange}
                                        placeholder="+33 1 23 45 67 89"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adresse" className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                    Adresse
                                </Label>
                                <Textarea
                                    id="adresse"
                                    name="adresse"
                                    value={formData.adresse}
                                    onChange={handleContactChange}
                                    placeholder="Adresse complète"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="respo" className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    Personne de contact
                                </Label>
                                <Input
                                    id="respo"
                                    name="respo"
                                    value={formData.respo}
                                    onChange={handleContactChange}
                                    placeholder="Nom du respo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes internes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes || ""}
                                    onChange={handleChange}
                                    placeholder="Notes additionnelles (visibles uniquement par l'équipe)"
                                    rows={4}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium">Information</p>
                            <p>Les champs marqués d'un astérisque (*) sont obligatoires.</p>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2 pt-2 border-t">
                        <Button type="button" variant="outline" onClick={setOpen}>
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className=" text-white"
                            disabled={loading}
                        >
                            {loading && <Loader2Icon className="animate-spin mr-2 h-4 w-4" />}
                            {isEditMode ? "Mettre à jour" : "Ajouter"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

