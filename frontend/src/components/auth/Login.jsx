import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { Dot, Eye, EyeClosed, Facebook, Loader2 } from 'lucide-react'
import { login } from '../../lib/api'
import { useAuth } from '../../context/useAuth'
import CustomToast from '../CustomToast'

const LoginPage = () => {
  const [toggle, setToggle] = useState(true)
  const { setUser, setToken } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await login(formData);
      console.log("res from login : ", res)
      setToken(res.token)
      setUser(res.user)
      setTimeout(() => {
        navigate("/")
      }, 3000)
      setLoading(false)
      CustomToast('success', 'Connexion réussie')
    } catch (error) {
      console.log("error from login : ", error)
      setError(error.response.data.message || "Une erreur s'est produite lors de la connexion")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='w-full flex h-screen'>
      <div className='hidden w-1/2 h-full bg-muted md:block'>
        <img src="/login.jpg" className='w-full h-full object-cover' alt="login" />
      </div>
      <div className='w-full md:w-1/2 h-full flex items-center justify-center'>
        <Card className="w-[50%]">
          <CardHeader>
            <h1 className='text-2xl font-semibold'>Connexion</h1>
            <p className='text-sm text-muted-foreground'>Veuillez entrer vos identifiants pour accéder à votre compte.</p>
            {
              error &&
              <div className='w-full h-12 rounded border-destructive border-2 bg-destructive/40 flex items-center px-4'>
                <Dot className='text-destructive' />
                <span className='text-destructive text-sm font-medium'>{error}</span>
              </div>
            }
          </CardHeader>
          <CardContent className="w-full">
            <form className='flex flex-col w-full gap-4' onSubmit={handelSubmit}>
              <div className='flex flex-col gap-1'>
                <label htmlFor='email' className='text-sm font-medium'>Email</label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Email'
                  className='w-full'
                  name="email"
                  value={formData.email}
                  onChange={handelChange}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor='password' className='text-sm font-medium'>Mot de passe</label>
                <div className='w-full rounded-lg shadow-sm border flex items-center justify-between pr-2'>
                  <Input
                    id='password'
                    type={toggle ? 'password' : 'text'}
                    placeholder='Mot de passe'
                    className='w-full border-none shadow-none'
                    name="password"
                    value={formData.password}
                    onChange={handelChange}
                  />
                  {toggle ? <Eye onClick={() => setToggle(!toggle)} /> : <EyeClosed onClick={() => setToggle(!toggle)} />}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span>Mot de passe oublié ?</span>
                <Link to='/reset-password' className='text-blue-600 hover:underline'>Réinitialiser le mot de passe</Link>
              </div>
              <button type='submit' className='bg-primary text-white py-2 px-4 rounded disabled:bg-primary/50' disabled={loading} >{loading ? <><Loader2 className="inline-block mr-2 animate-spin" />Connexion en cours ...</> : 'Connexion'} </button>
              <div className='w-fll border my-2 flex items-center justify-center h-[1px] bg-muted-foreground'>
                <span className='bg-white px-2 text-sm text-muted-foreground'>ou continuer avec</span>
              </div>
              <div className='w-full h-[5vh] flex items-center justify-center'>
                <div className='w-1/2 h-full flex items-center justify-center'>
                  <div className='w-[90%] border h-14 shadow rounded-2xl flex items-center justify-center gap-3'>
                    <img src="/google.svg" className='w-5' alt="" />
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
              <span className='text-sm text-muted-foreground'>Vous n'avez pas de compte ? <Link to='/signup' className='text-blue-600 hover:underline'>Inscrivez-vous</Link></span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage