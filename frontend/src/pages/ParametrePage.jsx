import { Settings2 } from 'lucide-react'
import Layout from '../Layout/Layout'
import React from 'react'
import ProfileInformations from '../components/settings/ProfileInformations'
import ChangePassword from '../components/settings/ChangePassword'
import { useAuth } from '../context/useAuth'
import DeleteAccount from '../components/settings/DeleteAccount'

const ParametrePage = () => {
    const { user } = useAuth()

    return (
        <Layout>
            <div className='flex flex-col'>
                <div className='w-full h-16 border-b gap-3 border-border flex items-center'>
                    <Settings2 size={30} />
                    <h1 className='text-2xl font-bold'>Paramètres</h1>
                </div>
                <ProfileInformations user={user} />
                <ChangePassword />
                <DeleteAccount />
            </div>
        </Layout>
    )
}

export default ParametrePage