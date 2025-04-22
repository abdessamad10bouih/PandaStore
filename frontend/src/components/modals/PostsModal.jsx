import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { CalendarIcon, CirclePlus, ImageIcon, X } from "lucide-react"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Calendar } from "../../components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { cn } from "../../lib/utils"
import { format } from "date-fns"

const PostsModal = () => {
    const [formData, setFormData] = useState({
        titre: "",
        type: "autre",
        description: "",
        contenu: "",
        status: "actif",
        dateDebut: null,
        dateFin: null,
        image: null,
    })

    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)

    const handelChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({
                ...formData,
                image: file,
            })

            // Create image preview
            const reader = new FileReader()
            reader.onload = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setFormData({
            ...formData,
            image: null,
        })
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Formulaire soumis :", formData)
        // Add your form submission logic here
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <CirclePlus className="mr-2" size={20} /> Créer un post
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <h2 className="text-2xl font-bold">Créer un post</h2>
                    <p className="text-sm text-muted-foreground">Créer un nouveau post</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-4 w-full">
                            <TabsTrigger value="details">Détails</TabsTrigger>
                            <TabsTrigger value="image">Image</TabsTrigger>
                            <TabsTrigger value="schedule">Planification</TabsTrigger>
                        </TabsList>

                        {/* Details Tab */}
                        <TabsContent value="details" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="titre" className="text-sm font-medium">
                                        Titre
                                    </label>
                                    <Input
                                        type="text"
                                        id="titre"
                                        name="titre"
                                        value={formData.titre}
                                        onChange={handelChange}
                                        className="border rounded-md"
                                        placeholder="Entrez le titre du post"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="type" className="text-sm font-medium">
                                        Type
                                    </label>
                                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                        <SelectTrigger className="border rounded-md w-full" id="type">
                                            <SelectValue placeholder="Sélectionnez le type de post" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nouveau_produit">Nouveau Produit</SelectItem>
                                            <SelectItem value="promotion">Promotion</SelectItem>
                                            <SelectItem value="offre_speciale">Offre Spéciale</SelectItem>
                                            <SelectItem value="autre">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="description" className="text-sm font-medium">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handelChange}
                                    className="border rounded-md"
                                    placeholder="Entrez la description du post"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="contenu" className="text-sm font-medium">
                                        Contenu
                                    </label>
                                    <Input
                                        type="text"
                                        id="contenu"
                                        name="contenu"
                                        value={formData.contenu}
                                        onChange={handelChange}
                                        className="border rounded-md"
                                        placeholder="Entrez le contenu du post"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="status" className="text-sm font-medium">
                                        Statut
                                    </label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                    >
                                        <SelectTrigger className="border rounded-md w-full" id="status">
                                            <SelectValue placeholder="Sélectionnez le statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="actif">Actif</SelectItem>
                                            <SelectItem value="inactif">Inactif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Image Tab */}
                        <TabsContent value="image" className="space-y-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="image" className="text-sm font-medium">
                                        Télécharger une image
                                    </label>
                                    <Input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="border rounded-md"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                    />
                                </div>

                                <div className="flex justify-center items-center">
                                    {imagePreview ? (
                                        <div className="relative mt-2 w-full max-w-[400px]">
                                            <img
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="Aperçu"
                                                className="w-full h-auto rounded-md object-cover border"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                                onClick={removeImage}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-[250px] border border-dashed rounded-md bg-muted/20">
                                            <div className="flex flex-col items-center text-muted-foreground">
                                                <ImageIcon size={48} />
                                                <p className="text-sm mt-2">Aucune image sélectionnée</p>
                                                <p className="text-xs mt-1">Téléchargez une image pour l'aperçu ici</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Schedule Tab */}
                        <TabsContent value="schedule" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="dateDebut" className="text-sm font-medium">
                                        Date de début
                                    </label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.dateDebut && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.dateDebut ? format(formData.dateDebut, "PPP") : <span>Sélectionnez une date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={formData.dateDebut}
                                                onSelect={(date) => {
                                                    setFormData((prev) => ({ ...prev, dateDebut: date }))
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="dateFin" className="text-sm font-medium">
                                        Date de fin
                                    </label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.dateFin && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.dateFin ? format(formData.dateFin, "PPP") : <span>Sélectionnez une date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.dateFin}
                                                onSelect={(date) => setFormData({ ...formData, dateFin: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="w-full mt-6 flex justify-end">
                        <Button type="submit">Créer le post</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default PostsModal
