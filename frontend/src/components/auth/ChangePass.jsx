import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { resetPassword } from '../../lib/api'
import { Button } from '../ui/button'
import { Eye, EyeOff, Lock } from 'lucide-react'
import CustomToast from '../CustomToast'
import { useNavigate } from 'react-router-dom'

const ChangePass = () => {

    const [formData, setFormdata] = useState({
        email: localStorage.getItem('email'),
        newPassword: "",
        confirmedPassword: "",
    })
    const navigate = useNavigate()
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)

    useEffect(() => {
        localStorage.removeItem('email');
        const isVerified = localStorage.getItem('otpVerified');
        if (!isVerified) {
            navigate('/reset-password');
        }
    }, []);


    const handleChange = (field, value) => {
        setFormdata((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }))
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const res = await resetPassword(formData)
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

    const toggleNewPassword = () => setShowNewPassword(!showNewPassword)
    const toggleConfirmedPassword = () => setShowConfirmedPassword(!showConfirmedPassword)


    return (
        <div className='w-full flex h-screen'>
            <div className='hidden w-1/2 h-full bg-muted md:block'>
                <img src="/login.jpg" className='w-full h-full object-cover' alt="connexion" />
            </div>
            <div className='w-full md:w-1/2 h-full flex items-center justify-center'>
                <Card className="w-[80%]">
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
                                    Modifier le mot de passe
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ChangePass