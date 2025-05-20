import { useProducts } from '../../context/ProductContext'
import React from 'react'

const BestPrividers = () => {
  const { fournisseurs } = useProducts()
  // console.log("fournisseurs", fournisseurs)
  return (
    <div className='w-full flex flex-col items-center justify-center p-10'>
      <h1 className='text-4xl font-bold'>Nos Meilleurs Fournisseurs</h1>
      <div className='w-full flex justify-around mt-6 py-4'>
        {fournisseurs.map((fournisseur) => (
          <div key={fournisseur._id} className='flex flex-col items-center justify-center'>
            <img
              src={fournisseur.logo}
              alt={fournisseur.nom}
              className='w-32 h-32 rounded-full'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestPrividers