import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Clock } from 'lucide-react'

const SujetsPopulaires = () => {
    const content = [
        {
            header: "Comment réinitialiser votre mot de passe", par: "Comment réinitialiser votre mot de passe", time: 3
        },
        {
            header: "Configurer la double authentification", par: "Renforcez la sécurité de votre compte", time: 5
        },
        {
            header: "Gérer vos paramètres de notifications", par: "Personnalisez vos préférences de communication", time: 4
        },
    ]
    return (
        <div className='w-full flex flex-col gap-4'>
            <h1 className='text-2xl font-semibold'>Sujets Populaires</h1>
            {
                content.map((con) => (
                    <Card>
                        <CardHeader className="py-4">
                            <h1 className='text-lg font-semibold'>{con.header}</h1>
                        </CardHeader>
                        <CardContent>
                            <p className='text-muted-foreground'>
                                {con.par}
                            </p>
                            <div className='w-full flex gap-3 items-center mt-4 text-muted-foreground'>
                                <Clock size={20} />
                                <p className='text-sm'>{con.time} min de lecture</p>
                            </div>
                        </CardContent>
                    </Card>
                ))
            }

        </div>
    )
}

export default SujetsPopulaires