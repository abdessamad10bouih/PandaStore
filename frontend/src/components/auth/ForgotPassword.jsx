import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { forgotPassword } from '../../lib/api'
import CustomToast from '../CustomToast'
import OTP from './OTP'

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        email: ''
    })
    const navigate = useNavigate()



    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await forgotPassword(formData)
            console.log("res", res)
            CustomToast("success", "Un email de réinitialisation a été envoyé à votre adresse email.")
            setLoading(false)
            setSuccess(true)
            localStorage.setItem('email', formData.email)

            navigate('/verifierOTP')
        } catch (error) {
            console.log("error", error)
            CustomToast("error", "Une erreur s'est produite lors de l'envoi de l'email de réinitialisation.")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='w-full flex h-screen'>
            <div className='hidden w-1/2 h-full bg-muted md:block'>
                <img src="/login.jpg" className='w-full h-full object-cover' alt="connexion" />
            </div>
            <div className='w-full md:w-1/2 h-full flex items-center justify-center'>
                <Card className="w-[50%]">
                    <CardHeader>
                        <h1 className='text-2xl font-semibold'>Mot de passe oublié</h1>
                        <p className='text-sm text-muted-foreground'>Veuillez entrer votre email pour recevoir un lien de réinitialisation.</p>
                    </CardHeader>
                    <CardContent className="w-full">
                        <form className='flex flex-col w-full gap-4' onSubmit={handelSubmit}>
                            <div className='flex flex-col justify-center gap-1'>
                                <label htmlFor="email" className='text-sm font-semibold'>Email</label>
                                <Input type="email" id='email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder='Entrez votre email' required />
                            </div>

                            <Button disabled={loading} type='submit' className='w-full'>
                                {loading ? (
                                    <>
                                        <Loader2 className='animate-spin' /> Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        {success ? "Vérifier votre email" : "Envoyer le lien de réinitialisation"}
                                    </>
                                )}
                            </Button>
                        </form>
                        <div className='w-full mt-5 flex items-center justify-center'>
                            <span className='text-sm text-muted-foreground'>Vous n'avez pas de compte ? <Link to='/signup' className='text-blue-600 hover:underline'>Inscrivez-vous</Link></span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPassword