import { useProducts } from '../../../context/ProductContext'
import React from 'react'
import CategoriesCard from './CategoriesCard'
import { Button } from '../../ui/button'
import { Link } from 'react-router-dom'

const ShopByCategorie = () => {
    const { categories } = useProducts()
    const limitedCategories = categories.slice(0, 4)
    // console.log("categories", categories)
    return (
        <div className='container mx-auto'>
            <div className='w-full flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-center py-5'>Achetez par catégories</h2>
                <Link to="/categories" className='text-sm text-muted-foreground hover:text-emerald-600 transition-all duration-200'>Voir tout</Link>
            </div>
            <div className='w-full grid grid-cols-4 gap-4 py-5'>
                {limitedCategories.map((categorie) => (
                    <CategoriesCard categorie={categorie} />
                ))}
            </div>
        </div>
    )
}

export default ShopByCategorie