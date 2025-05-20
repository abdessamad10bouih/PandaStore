import { useProducts } from '../context/ProductContext'
import React from 'react'
import PostCard from './PostsCard'

const PostsDisplay = () => {
    const { posts } = useProducts()
    // console.log("posts : ", posts)
    return (
        <div className='w-full flex gap-4 flex-wrap p-2'>
            {posts.length === 0 && (
                <div className='w-full flex justify-center items-center h-96'>
                    <h1 className='text-2xl font-bold'>Aucun post trouvé</h1>
                </div>
            )}
            {posts.map((post, index) => (
                <PostCard key={index} promotion={post} />
            ))}
        </div>
    )
}

export default PostsDisplay