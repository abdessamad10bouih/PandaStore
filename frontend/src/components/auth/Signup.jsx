import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeClosed, Facebook, Loader2 } from 'lucide-react'
import { register } from '../../lib/api'
import CustomToast from '../CustomToast'

const Signup = () => {
    const [toggle, setToggle] = useState(true)
    const [toggle2, setToggle2] = useState(true)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        nom: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handelChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await register(formData);
            console.log("res from register : ", res)
            CustomToast("success", res.message || "Inscription réussie")
            setTimeout(() => {
                navigate('/login')
            }, 3000)
            setLoading(false)
        } catch (error) {
            console.log("error from register : ", error)
            CustomToast("error", error.response.data.message || "Une erreur s'est produite lors de l'inscription")
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='w-full flex h-screen'>
            <div className='w-1/2 h-full bg-muted'></div>
            <div className='w-1/2 h-full flex items-center justify-center'>
                <Card className="w-[50%]">
                    <CardHeader>
                        <h1 className='text-2xl font-semibold'>S'inscrire</h1>
                        <p className='text-sm text-muted-foreground'>Créez un compte pour commencer.</p>
                    </CardHeader>
                    <CardContent className="w-full">
                        <form className='flex flex-col w-full gap-4' onSubmit={handelSubmit}>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='nom' className='text-sm font-medium'>Nom</label>
                                <Input
                                    id='nom'
                                    name='nom'
                                    type='text'
                                    placeholder='Votre nom'
                                    className='w-full'
                                    value={formData.nom}
                                    onChange={handelChange}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='email' className='text-sm font-medium'>Email</label>
                                <Input
                                    id='email'
                                    name='email'
                                    type='email'
                                    placeholder='Email'
                                    className='w-full'
                                    value={formData.email}
                                    onChange={handelChange}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='password' className='text-sm font-medium'>Mot de passe</label>
                                <div className='w-full rounded-lg shadow-sm border flex items-center justify-between pr-2'>
                                    <Input
                                        id='password'
                                        name='password'
                                        type={toggle ? 'password' : 'text'}
                                        placeholder='Mot de passe'
                                        className='w-full border-none shadow-none'
                                        value={formData.password}
                                        onChange={handelChange}
                                    />
                                    {toggle ? <Eye onClick={() => setToggle(!toggle)} /> : <EyeClosed onClick={() => setToggle(!toggle)} />}
                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='confirm-password' className='text-sm font-medium'>Confirmer le mot de passe</label>
                                <div className='w-full rounded-lg shadow-sm border flex items-center justify-between pr-2'>
                                    <Input
                                        id='confirm-password'
                                        name='confirmPassword'
                                        type={toggle2 ? 'password' : 'text'}
                                        placeholder='Confirmer le mot de passe'
                                        className='w-full border-none shadow-none'
                                        value={formData.confirmPassword}
                                        onChange={handelChange}
                                    />
                                    {toggle2 ? <Eye onClick={() => setToggle2(!toggle2)} /> : <EyeClosed onClick={() => setToggle2(!toggle2)} />}
                                </div>
                            </div>
                            <button type='submit' className='bg-primary text-white py-2 px-4 rounded' disabled={loading}>
                                {loading ? <><Loader2 className="inline-block mr-2 animate-spin" />Inscription en cours ...</> : 'S\'inscrire'}
                            </button>
                            <div className='w-full border my-2 flex items-center justify-center h-[1px] bg-muted-foreground'>
                                <span className='bg-white px-2 text-sm text-muted-foreground'>ou continuer avec</span>
                            </div>
                            <div className='w-full h-[5vh] flex items-center justify-center'>
                                <div className='w-1/2 h-full flex items-center justify-center'>
                                    <div className='w-[90%] border h-14 shadow rounded-2xl flex items-center justify-center gap-3'>
                                        <img src="/google.svg" className='w-5' alt="Google" />
                                        <h1 className='text-md'>Google</h1>
                                    </div>
                                </div>
                                <div className='w-1/2 h-full flex items-center justify-center'>
                                    <div className='w-[90%] border h-14 shadow rounded-2xl flex items-center justify-center gap-3'>
                                        <Facebook />
                                        <h1 className='text-md'>Facebook</h1>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className='w-full mt-5 flex items-center justify-center'>
                            <span className='text-sm text-muted-foreground'>Vous avez déjà un compte ? <Link to='/login' className='text-blue-600 hover:underline'>Se connecter</Link></span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Signup