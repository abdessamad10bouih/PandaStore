import { useProducts } from '../../context/ProductContext'
import React from 'react'
import PostCard from '../PostsCard'
import OfferCard from './Offers/OfferCard'

const OffersSection = () => {
    const { posts } = useProducts()
    // console.log("posts : ", posts)
    return (
        <div className='w-full flex gap-4 flex-wrap p-2'>
            {posts.slice(0, 1).map((post, index) => (
                <OfferCard post={post} key={index} />
            ))}
        </div>
    )
}

export default OffersSection