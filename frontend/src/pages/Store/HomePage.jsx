import React from 'react'
import HomeNavbar from './HomeNavbar'
import HeroSection from '../../components/Home/HeroSection'
import NewProducts from '../../components/Home/NewProducts'
import BestPrividers from '../../components/Home/BestPrividers'
import OffersSection from '../../components/Home/OffersSection'
import ShopByCategorie from '../../components/Home/Categories/ShopByCategorie'
import Newsletter from '../../components/Home/Newsletter'
import { Footer } from '../../components/Home/Footer'

const HomePage = () => {
  return (
    <div className='w-full flex flex-col'>
      <div className='w-full container mx-auto'>
        <HomeNavbar />
      </div>
      <HeroSection />
      <div className='w-full container mx-auto'>
        <NewProducts />
        <BestPrividers />
      </div>
      <OffersSection />
      <div className='w-full container mx-auto'>
        <ShopByCategorie />
      </div>
      <section className="w-full  flex items-center justify-center p-5">
        <Newsletter />
      </section>
      <Footer />
    </div>
  )
}

export default HomePage