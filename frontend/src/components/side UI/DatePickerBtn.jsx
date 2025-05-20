import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar } from '../ui/calendar'

const DatePickerBtn = ({ date, handleDateChange }) => {

    return (
        <div className="relative">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="dateDebut"
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                            format(date, "PPP", { locale: fr })
                        ) : (
                            <span>Sélectionner une date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 pointer-events-auto" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default DatePickerBtn