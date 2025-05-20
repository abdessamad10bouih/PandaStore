import { CalendarDays, Clock } from "lucide-react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

import { Badge } from "./ui/badge"
// Removed unused Button import
import { Card, CardContent, CardFooter } from "./ui/card"
import PostsModal from "./modals/PostsModal"
import { DeleteModal } from "./modals/DeleteModal"
import { supprimerPost } from "../lib/api"
import { useProducts } from "../context/ProductContext"
import CustomToast from "./CustomToast"
import OfferTimer from "./Home/OfferTimer"
import { useLocation } from "react-router-dom"

export default function PostCard({ promotion }) {
    const uri = useLocation().pathname

    // console.log("uri", uri)
    const startDate = promotion.dateDebut ? parseISO(promotion.dateDebut) : null
    const endDate = promotion.dateFin ? parseISO(promotion.dateFin) : null
    const { setPosts } = useProducts()

    const formattedStartDate = format(startDate, "d MMMM yyyy", { locale: fr })
    const formattedEndDate = endDate !== null ? format(endDate, "d MMMM yyyy", { locale: fr }) : "--"


    const deletePost = async () => {
        try {
            const res = await supprimerPost(promotion._id)
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== promotion._id))
            CustomToast("success", res.data.message);
        } catch (error) {
            console.error("Error deleting post:", error)
            CustomToast("error", "Erreur lors de la suppression du post")
        }
    }
    return (
        <Card className="overflow-hidden relative w-full max-w-md">
            {/* Background image with overlay */}
            <div className="absolute inset-0 z-0">
                <img src={promotion.image || "/placeholder.svg"} alt={promotion.titre} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-blue-900/75" />
            </div>

            {/* Status badge */}
            <Badge variant={promotion.status === "actif" ? "success" : "secondary"} className={`absolute top-4 left-4 z-10 text-card ${promotion.status === "actif" ? "bg-green-500/40" : "bg-red-500/40"}`}>
                {promotion.status === "actif" ? "Actif" : "Inactif"}
            </Badge>

            <CardContent className="relative z-10 pt-12 pb-4 text-white">
                <h3 className="text-xl font-bold mb-2">{promotion.titre}</h3>
                <p className="text-sm text-white/80 mb-6 line-clamp-2">{promotion.contenu}</p>

                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-white/70" />
                        <span>Début: {formattedStartDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white/70" />
                        <span>Fin: {formattedEndDate}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="relative z-10 flex justify-center gap-2 p-4 pt-0 w-full">
                {uri === "/dashboard/posts" && (
                    <>
                        <PostsModal mode="edit" post={promotion} />
                        <DeleteModal use="max" className={'w-[60%]'} supprimerFun={deletePost} text={"Supprimer Post"} />
                    </>
                )}
            </CardFooter>
            <div className="relative z-10 flex justify-center gap-2 p-4 pt-0 w-full">
                <OfferTimer endDateString={promotion.dateFin} />
            </div>
        </Card>
    )
}

// hada rah fdak produit kaysawi null