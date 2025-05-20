import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Avatar, AvatarImage } from "../ui/avatar"
import { cn } from "../../lib/utils"

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Sélectionner...",
    emptyMessage = "Aucun élément trouvé.",
    className,
}) {
    const [open, setOpen] = useState(false)
    const [selectedItems, setSelectedItems] = useState(selected || [])

    // Sync with external state
    useEffect(() => {
        setSelectedItems(selected || [])
    }, [selected])

    const handleSelect = (value) => {
        const newSelectedItems = selectedItems.includes(value)
            ? selectedItems.filter((item) => item !== value)
            : [...selectedItems, value]

        setSelectedItems(newSelectedItems)
        onChange(newSelectedItems)
    }

    const handleRemove = (value, e) => {
        e.stopPropagation()
        const newSelectedItems = selectedItems.filter((item) => item !== value)
        setSelectedItems(newSelectedItems)
        onChange(newSelectedItems)
    }

    // Find option objects for selected IDs
    const selectedOptions = options.filter((option) => selectedItems.includes(option.value))

    // Determine how many badges to show directly
    const maxVisibleBadges = 2
    const visibleBadges = selectedOptions.slice(0, maxVisibleBadges)
    const hiddenBadgesCount = Math.max(0, selectedOptions.length - maxVisibleBadges)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between h-auto min-h-10 py-2", className)}
                >
                    <div className="flex flex-wrap gap-1 items-center max-w-[90%] overflow-hidden">
                        {selectedOptions.length > 0 ? (
                            <>
                                {visibleBadges.map((option) => (
                                    <Badge key={option.value} variant="secondary" className="mr-1 mb-1">
                                        {option.image && (
                                            <Avatar className="h-5 w-5 mr-1">
                                                <AvatarImage src={option.image || "/placeholder.svg"} alt={option.label} />
                                            </Avatar>
                                        )}
                                        <span className="max-w-[100px] truncate">{option.label}</span>
                                        <button
                                            className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                            onClick={(e) => handleRemove(option.value, e)}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                {hiddenBadgesCount > 0 && (
                                    <Badge variant="secondary" className="mb-1">
                                        +{hiddenBadgesCount} {hiddenBadgesCount === 1 ? "autre" : "autres"}
                                    </Badge>
                                )}
                            </>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 pointer-events-auto" align="start">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => (
                                <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                                    <div className="flex items-center gap-2 w-full">
                                        <div
                                            className={cn(
                                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selectedItems.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50",
                                            )}
                                        >
                                            {selectedItems.includes(option.value) && <Check className="h-3 w-3" />}
                                        </div>
                                        {option.image && (
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={option.image || "/placeholder.svg"} alt={option.label} />
                                            </Avatar>
                                        )}
                                        <span className="truncate">{option.label}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
