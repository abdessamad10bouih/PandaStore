import { Trash } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { toast } from "sonner"

export function DeleteModal({ supprimerFun, text, use = "min", className }) {


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {use === "max" ? <Button variant="primary" className={`bg-destructive w-full text-white hover:bg-destructive/80 ${className} cursor-pointer`}>
                    <Trash className="text-white" />
                    {text ? text : "Supprimer"}
                </Button> : <Trash className="text-red-500 cursor-pointer" size={19} />}

            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Cela supprimera définitivement votre produit de la base de données.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction className={"bg-destructive"} onClick={supprimerFun}>Continuer</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
