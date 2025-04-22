import { useProducts } from '../context/ProductContext'
import CategoriesTable from '../components/CategoriesTable'
import Layout from '../Layout/Layout'
import React from 'react'
import { CirclePlus } from 'lucide-react'
import { Button } from '../components/ui/button'
import CategorieModal from '../components/modals/CategorieModal'

const Categories = () => {
    const { categories } = useProducts();
    console.log(categories)
    return (
        <Layout>
            <div className='w-full flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Categories</h1>
                <CategorieModal />

            </div>
            <CategoriesTable categoriesData={categories} />
        </Layout>
    )
}

export default Categories