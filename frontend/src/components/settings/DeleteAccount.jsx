import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { TriangleAlert } from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'

const DeleteAccount = () => {
    const [agreed, setAgreed] = useState(true)

    return (
        <div className='w-full justify-center items-center flex p-2'>
            <Card className="w-full border-2 border-destructive">
                <CardHeader>
                    <div className='w-full flex gap-2 items-center'>
                        <TriangleAlert size={26} className='text-destructive mb-1 font-bold' />
                        <h1 className='text-2xl text-destructive font-semibold'>Supprimer le compte</h1>
                    </div>
                </CardHeader>
                <CardContent >
                    <form action="" className='flex flex-col gap-3'>
                        <h1 className='text-destructive'>Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Veuillez en être certain.</h1>
                        <div className='w-full flex gap-2 items-center'>
                            <Checkbox
                                id="isSubcategory"
                                className="mb-1"
                                onCheckedChange={(agreed) => setAgreed(!agreed)}
                            />
                            <h1 className='text-muted-foreground'>Je comprends que cette action est irréversible et que toutes mes données seront définitivement supprimées</h1>
                        </div>
                        <div className='w-full flex items-center justify-end'>
                            <Button className="bg-destructive" disabled={agreed}>
                                Supprimer le compte
                            </Button>
                        </div>
                    </form>
                </CardContent >
            </Card>
        </div>
    )
}

export default DeleteAccount