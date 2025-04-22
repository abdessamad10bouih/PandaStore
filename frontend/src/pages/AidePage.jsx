import SujetsPopulaires from '../components/Help/SujetsPopulaires'
import AideSection from '../components/Help/AideSection'
import Layout from '../Layout/Layout'
import React from 'react'
import { HelpingHandIcon } from 'lucide-react'

const AidePage = () => {
    return (
        <Layout>
            <div className='w-full flex flex-col p-4 gap-5'>
                <div className='w-full border-b border-border flex items-center gap-2 pb-3'>
                    <HelpingHandIcon size={50}/>
                    <h1 className='text-2xl font-bold'>Aide et support</h1>
                </div>
                <AideSection />
                <SujetsPopulaires />
            </div>
        </Layout>
    )
}

export default AidePage