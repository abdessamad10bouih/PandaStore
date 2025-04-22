import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { ArrowRightIcon, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AideCard = ({ icon, text, par, takeTo }) => {
    const navigate = useNavigate()
    return (
        <Card className="w-[49.3%] flex flex-col" onClick={() => navigate(takeTo)}>
            <CardHeader>
                <div className='w-full flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                        <div className='h-14 w-14 bg-muted rounded-xl flex items-center justify-center'>
                            {icon}
                        </div>
                        <h1 className='text-xl'>{text}</h1>
                    </div>
                    <ArrowRightIcon />
                </div>
            </CardHeader>
            <CardContent>
                <h1 className='text-muted-foreground'>{par}</h1>
            </CardContent>
        </Card>
    )
}

export default AideCard