import { MoreHorizontal, Edit, Trash2, ExternalLink, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import FournisseurModal from "../modals/FournisseurModal"
import { DeleteModal } from "../modals/DeleteModal"
import { rechercherFournisseurs, supprimerFournisseur } from "../../lib/api"
import { toast } from "sonner"
import { useProducts } from "../../context/ProductContext"
import CustomToast from "../CustomToast"



export default function TableFournisseurs({ fournisseurs }) {
  // console.log("fournisseur : ", fournisseurs)
  const { setFournisseurs } = useProducts()
  const deleteFournisseur = async (fournisseurId) => {
    try {
      const res = await supprimerFournisseur(fournisseurId)
      CustomToast("success", res.data.message || "Fournisseur supprimé avec succès")
      setFournisseurs((prev) => prev.filter((fournisseur) => fournisseur._id !== fournisseurId))
    } catch (error) {
      CustomToast("error", "Error deleting fournisseur:", error)
      toast.error(error.response?.data?.message || "Erreur lors de la suppression du fournisseur")
    }
  }

  const handleRecherche = async (query) => {
    try {
      const res = await rechercherFournisseurs(query)
      setFournisseurs(res.data)
      // console.log("fournisseurs : ", res.data)
      // setFournisseurs((prev) => prev.filter((fournisseur) => fournisseur.nom.toLowerCase().includes(query.toLowerCase())))
    } catch (error) {
      console.error("Error searching fournisseurs:", error)
      toast.error(error.response?.data?.message || "Erreur lors de la recherche des fournisseurs")
    }
  }
  console.log("fournisseurs : ", fournisseurs)

  const filterByStatus = (status) => {
    const filteredFournisseurs = fournisseurs.filter((fournisseur) => fournisseur.status === status)
    console.log("filteredFournisseurs : ", filteredFournisseurs)
    if (status === "all") {
      setFournisseurs(fournisseurs)
    } else if (status === "actif") {
      setFournisseurs(filteredFournisseurs)
    } else if (status === "inactive") {
      setFournisseurs(filteredFournisseurs)
    }
    setFournisseurs(filteredFournisseurs)
  }
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col w-full space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input onChange={(e) => handleRecherche(e.target.value)} placeholder="Rechercher un fournisseur..." className="pl-10" />
        </div>
        <div className="flex space-x-4">
          <Select defaultValue="all" onValueChange={(value) => filterByStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fournisseurs.map((fournisseur) => (
              <TableRow key={fournisseur?._id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={fournisseur?.logo || "/noimage.jpg"}
                      alt={`Logo ${fournisseur?.nom}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{fournisseur?.nom}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">Email:</span>
                      <a href={`mailto:${fournisseur?.contact?.email}`} className="text-blue-600 hover:underline">
                        {fournisseur?.contact?.email || "N/A"}
                      </a>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">Tél:</span>
                      <a href={`tel:${fournisseur?.contact?.tel}`} className="hover:underline">
                        {fournisseur?.contact?.tel || "N/A"}
                      </a>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">Responsable:</span>
                      <a className="hover:underline">
                        {fournisseur?.contact?.respo || "N/A"}
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={fournisseur?.status === "actif" ? "success" : "secondary"}
                    className={
                      fournisseur?.status === "actif"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {fournisseur?.status === "actif" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <FournisseurModal mode="edit" fournisseur={fournisseur} />
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeleteModal use="max" supprimerFun={() => { console.log("fournisseur id :", fournisseur._id); deleteFournisseur(fournisseur._id) }} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">Affichage de 1 à 5 sur 5 fournisseurs</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>
          <Button variant="outline" size="sm" disabled>
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

