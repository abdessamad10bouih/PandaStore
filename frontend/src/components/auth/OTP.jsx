import { OTPInput } from 'input-otp'
import React, { useEffect, useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'
import { useAuth } from '../../context/useAuth'
import { verifierOTP } from '../../lib/api'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import CustomToast from '../CustomToast'

const OTP = () => {
    const email = localStorage.getItem('email')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (!email) {
            navigate('/reset-password');
        }
    }, []);


    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await verifierOTP({ email, otp });
            console.log("res", res.data);
            setLoading(false);
            CustomToast("success", "OTP vérifié avec succès.")
            localStorage.setItem('otpVerified', 'true');
            navigate('/changer-password')
        } catch (error) {
            console.error('Error verifying OTP:', error.response ? error.response.data : error);
            CustomToast("error", "Une erreur s'est produite lors de la vérification de l'OTP.")
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
                        <form onSubmit={handleSubmit} className='flex items-center justify-center w-full flex-col'>
                            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)} className="w-full max-w-[400px]">
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <Button className={'w-full mt-5'} type='submit' disabled={loading}>
                                {loading ? 'Vérification...' : 'Vérifier'}
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

export default OTP