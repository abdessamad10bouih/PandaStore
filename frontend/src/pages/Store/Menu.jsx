import React from 'react'
import { cn } from '../../lib/utils'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../../components/ui/navigation-menu'
import { Folder, Shirt } from 'lucide-react'
import { Link } from 'react-router-dom'

const components = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]
const Menu = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Vêtements</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full flex-col justify-end rounded-md p-6"
                                        style={{
                                            background: "url('/model.jpg') center center",
                                            backgroundSize: "cover",
                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                            backgroundBlendMode: "overlay"
                                        }}
                                        href="/clothes"
                                    >
                                        <Shirt className="h-6 w-6" />
                                        <div className="mb-2 mt-4 text-lg font-medium text-white">
                                            Découvrez notre section vêtements
                                        </div>
                                        <p className="text-sm text-white">
                                            Explorez une collection soigneusement conçue pour répondre à vos besoins.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem to="/clothes/t-shirts" title="T-shirts">
                                Découvrez notre gamme de t-shirts confortables et stylés, parfaits pour toutes les occasions.
                            </ListItem>
                            <ListItem to="/clothes/polos" title="Polos">
                                Découvrez notre collection de polos élégants et polyvalents, adaptés à toutes les situations.
                            </ListItem>
                            <ListItem to="/clothes/sport" title="Sport">
                                Découvrez notre sélection de vêtements de sport, conçus pour allier performance et style.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Électroniques</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full flex-col justify-end rounded-md p-6"
                                        style={{
                                            background: "url('/electronics_img.avif') center center",
                                            backgroundSize: "cover",
                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                            backgroundBlendMode: "overlay"
                                        }}
                                        href="/electronics"
                                    >
                                        <Folder className="h-6 w-6" />
                                        <div className="mb-2 mt-4 text-lg font-medium text-white">
                                            Découvrez notre section électroniques
                                        </div>
                                        <p className="text-sm text-white">
                                            Explorez une gamme d'appareils électroniques modernes et performants.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem to="/electronics/phones" title="Téléphones">
                                Découvrez notre sélection de téléphones dernier cri, alliant design et technologie.
                            </ListItem>
                            <ListItem to="/electronics/laptops" title="Ordinateurs Portables">
                                Parcourez notre collection d'ordinateurs portables pour le travail ou le divertissement.
                            </ListItem>
                            <ListItem to="/electronics/accessories" title="Accessoires">
                                Trouvez des accessoires électroniques pour compléter vos appareils.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Maison & Cuisine</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full flex-col justify-end rounded-md p-6"
                                        style={{
                                            background: "url('/furniture_img.jpg') center center",
                                            backgroundSize: "cover",
                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                            backgroundBlendMode: "overlay"
                                        }}
                                        href="/furniture"
                                    >
                                        <Folder className="h-6 w-6" />
                                        <div className="mb-2 mt-4 text-lg font-medium text-white">
                                            Découvrez notre section Maison & Cuisine
                                        </div>
                                        <p className="text-sm text-white">
                                            Explorez une gamme de meubles et d'appareils pour votre maison.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem to="/furniture/bedding" title="Bedding & Bath">
                                Découvrez notre collection de literie et accessoires de bain pour un confort optimal.
                            </ListItem>
                            <ListItem to="/furniture/kitchen" title="Kitchen Appliances">
                                Explorez nos appareils de cuisine modernes et fonctionnels.
                            </ListItem>
                            <ListItem to="/furniture/decor" title="Home Decor">
                                Trouvez des décorations élégantes pour embellir votre maison.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Menu

const ListItem = (({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})