import PostsDisplay from '../components/PostsDisplay'
import PostsModal from '../components/modals/PostsModal'
import Layout from '../Layout/Layout'
import React from 'react'

const Posts = () => {
    return (
        <Layout>
            <div className='p-4 flex flex-col'>
                <div className='flex justify-between'>
                    <h1 className='text-4xl font-bold'>Posts</h1>
                    <PostsModal />
                </div>
            </div>
            <div>
                <div className='w-full flex gap-4 flex-wrap justify-center'>
                    <PostsDisplay />
                </div>
            </div>
        </Layout>
    )
}

export default Posts