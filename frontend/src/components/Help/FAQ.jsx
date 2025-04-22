import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb'
import Layout from '../../Layout/Layout'
import { ChevronRight, HelpingHandIcon, SearchIcon, Slash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import FAQTabs from './TabsContent/FAQTabs'
import FAQPaiment from './TabsContent/FAQPaiment'
import FAQTechnique from './TabsContent/FAQTechnique'
import FAQGuide from './TabsContent/FAQGuide'

const FAQ = () => {
    return (
        <Layout>
            <div className='w-full flex flex-col p-4 gap-5'>
                <div className='w-full border-b border-border flex items-center gap-2 pb-3'>
                    <HelpingHandIcon size={50} />
                    <Link to={"/aide"}>
                        <h1 className='text-2xl font-bold'>Aide et support</h1>
                    </Link>
                    <ChevronRight size={30} />
                    <Link to={"/aide/FAQ"}>
                        <h1 className='text-2xl font-bold'>FAQ</h1>
                    </Link>
                </div>
                <div className='w-full flex items-center px-3 gap-2'>
                    <Input className="shadow-none" placeholder="Rechercher dans les FAQs..." />
                    <Button>
                        <SearchIcon />
                        Rechercher
                    </Button>
                </div>
                <Tabs defaultValue="compte">
                    <TabsList className='bg-muted w-full'>
                        <TabsTrigger value="compte">Compte</TabsTrigger>
                        <TabsTrigger value="paiments">Paiments</TabsTrigger>
                        <TabsTrigger value="technique">Technique</TabsTrigger>
                        <TabsTrigger value="guide">Guide d'utilisation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="compte">
                        <FAQTabs />
                    </TabsContent>
                    <TabsContent value="paiments">
                        <FAQPaiment />
                    </TabsContent>
                    <TabsContent value="technique">
                        <FAQTechnique />
                    </TabsContent>
                    <TabsContent value="guide">
                        <FAQGuide />
                    </TabsContent>
                </Tabs>

            </div>
        </Layout>
    )
}

export default FAQ