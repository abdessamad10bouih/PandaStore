import { Plus, Table2Icon } from 'lucide-react'
import { Button } from '../components/ui/button'
import Layout from '../Layout/Layout'
import React from 'react'
import TableFournisseurs from '../components/fournisseur/TableFournisseurs'
import { useProducts } from '../context/ProductContext'
import FournisseurModal from '../components/modals/FournisseurModal'

const FournisseurPage = () => {
    const { fournisseurs } = useProducts()
    return (
        <Layout>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Fournisseurs</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez vos fournisseurs et leurs informations de contact</p>
                </div>
                <FournisseurModal />
            </div>
            <div className='w-full flex items-center justify-center'>
                <TableFournisseurs fournisseurs={fournisseurs}/>
            </div>
        </Layout>
    )
}

export default FournisseurPage