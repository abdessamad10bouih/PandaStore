

import { useState } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Eye, EyeOff, Lock, PencilLineIcon } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { changePassword } from "../../lib/api"
import { useAuth } from "../../context/useAuth"
import { useNavigate } from "react-router-dom"
import CustomToast from "../CustomToast"

const ChangePassword = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormdata] = useState({
        userId: user._id,
        currentPassword: "",
        newPassword: "",
        confirmedPassword: "",
    })

    // Add state to track password visibility for each field
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)

    const handleChange = (field, value) => {
        setFormdata((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }))
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()

        // Add validation to check if passwords match
        if (formData.newPassword !== formData.confirmedPassword) {
            return CustomToast("error", "Les mots de passe ne correspondent pas")
        }

        try {
            const res = await changePassword(formData)
            console.log("results", res.data)
            CustomToast("success", res.data.message)
            setTimeout(() => {
                navigate("/login")
            }, 2000)
        } catch (error) {
            console.log("error", error)
            CustomToast("error", error.response.data.message || "Erreur lors modification du mot de passe")
        }
    }

    // Toggle password visibility functions
    const toggleCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword)
    const toggleNewPassword = () => setShowNewPassword(!showNewPassword)
    const toggleConfirmedPassword = () => setShowConfirmedPassword(!showConfirmedPassword)

    return (
        <div className="w-full justify-center items-center flex p-2">
            <Card className="w-full">
                <CardHeader>
                    <h1 className="text-xl font-semibold">Changer le mot de passe</h1>
                    <p className="text-muted-foreground text-sm">
                        Assurez-vous que votre compte utilise un mot de passe sécurisé
                    </p>
                </CardHeader>
                <CardContent>
                    <form className="w-full flex flex-col gap-3" onSubmit={handlePasswordChange}>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Lock size={20} className="mb-1" />
                                <label htmlFor="" className="text-md">
                                    Mot de passe actuel
                                </label>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={formData.currentPassword}
                                    onChange={(e) => handleChange("currentPassword", e.target.value)}
                                    className="h-12 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-12 w-12"
                                    onClick={toggleCurrentPassword}
                                >
                                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    <span className="sr-only">
                                        {showCurrentPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Lock size={20} className="mb-1" />
                                <label htmlFor="" className="text-md">
                                    Nouveau mot de passe
                                </label>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => handleChange("newPassword", e.target.value)}
                                    className="h-12 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-12 w-12"
                                    onClick={toggleNewPassword}
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    <span className="sr-only">
                                        {showNewPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground text-sm">
                                Le mot de passe doit comporter au moins 8 caractères et inclure des chiffres et des symboles
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Lock size={20} className="mb-1" />
                                <label htmlFor="" className="text-md">
                                    Confirmer le nouveau mot de passe
                                </label>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showConfirmedPassword ? "text" : "password"}
                                    value={formData.confirmedPassword}
                                    onChange={(e) => handleChange("confirmedPassword", e.target.value)}
                                    className="h-12 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-12 w-12"
                                    onClick={toggleConfirmedPassword}
                                >
                                    {showConfirmedPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    <span className="sr-only">
                                        {showConfirmedPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-end mt-2">
                            <Button className="h-full">
                                <PencilLineIcon className="mr-2" />
                                Modifier le mot de passe
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ChangePassword
