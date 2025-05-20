import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white">
            {/* Pied de page principal */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Colonne 1 : À propos */}
                    <div>
                        <div className="flex items-center mb-6">
                            <div className="relative h-10 w-full flex items-center">
                                <img
                                    src="logo_white.webp"
                                    alt="Logo PandaStore"
                                    fill
                                    className="w-[90%]"
                                />
                            </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Votre destination de confiance pour des produits écologiques et durables. Rendre le monde plus vert, un achat à la fois.
                        </p>
                        <div className="flex space-x-4 mb-6">
                            <Link
                                to="#"
                                className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook size={16} />
                            </Link>
                            <Link
                                to="#"
                                className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram size={16} />
                            </Link>
                            <Link
                                to="#"
                                className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter size={16} />
                            </Link>
                            <Link
                                to="#"
                                className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube size={16} />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-gray-300">
                                <Phone size={16} className="mr-2" />
                                <span>+1 (888) 123-4567</span>
                            </div>
                            <div className="flex items-center text-gray-300">
                                <Mail size={16} className="mr-2" />
                                <span>support@pandastore.com</span>
                            </div>
                            <div className="flex items-start text-gray-300">
                                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                                <span>123 Rue Verte, Ville Éco, EC 12345, États-Unis</span>
                            </div>
                        </div>
                    </div>

                    {/* Colonne 2 : Boutique */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Boutique</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Nouveautés
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Meilleures ventes
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Maison Éco
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Mode durable
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Collection Bambou
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Zéro Déchet
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Cartes cadeaux
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Promotions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Colonne 3 : Service client */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Service client</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Nous contacter
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Livraison
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Retours & Échanges
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Suivre votre commande
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Politique de confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:underline">
                                    Conditions générales
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Paiements sécurisés</h3>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-sm mb-6">
                            <div className="flex items-center mb-3">
                                <Shield className="h-5 w-5 text-white mr-2" />
                                <span className="font-medium text-white">Paiements 100% sécurisés</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-4">
                                Vos informations de paiement sont traitées en toute sécurité. Nous ne stockons pas les détails de votre carte de crédit ni n'y avons accès.
                            </p>

                            {/* Logos des méthodes de paiement */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-gray-800 p-2 rounded border border-gray-700 flex items-center justify-center">
                                    <img
                                        src="/visa.png"
                                        alt="Visa"
                                        width={48}
                                        height={30}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="bg-gray-800 p-2 rounded border border-gray-700 flex items-center justify-center">
                                    <img
                                        src="/mastercard.png"
                                        alt="Mastercard"
                                        width={48}
                                        height={30}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="bg-gray-800 p-2 rounded border border-gray-700 flex items-center justify-center">
                                    <img
                                        src="/ae.png"
                                        alt="American Express"
                                        width={48}
                                        height={30}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="bg-gray-800 p-2 rounded border border-gray-700 flex items-center justify-center">
                                    <img
                                        src="/paypal.png"
                                        alt="PayPal"
                                        width={48}
                                        height={30}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="bg-gray-800 p-2 rounded border border-gray-700 flex items-center justify-center">
                                    <img
                                        src="/apple-pay.png"
                                        alt="Apple Pay"
                                        width={48}
                                        height={30}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="bg-gray-800 p-2 rounded border border-gray-700 flex items-center justify-center">
                                    <img
                                        src="/google-pay.png"
                                        alt="Google Pay"
                                        width={48}
                                        height={30}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Badges de sécurité */}
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="bg-gray-900 px-3 py-2 rounded border border-gray-800 flex items-center">
                                <Lock className="h-4 w-4 text-white mr-2" />
                                <span className="text-xs font-medium text-white">SSL Sécurisé</span>
                            </div>
                            <div className="bg-gray-900 px-3 py-2 rounded border border-gray-800 flex items-center">
                                <Shield className="h-4 w-4 text-white mr-2" />
                                <span className="text-xs font-medium text-white">Conforme PCI</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2">Nous expédions avec</h3>
                        <div className="flex flex-wrap gap-2">
                            <div className="bg-gray-900 p-2 rounded border border-gray-800 flex items-center justify-center">
                                <img
                                    src="/dhl.png"
                                    alt="DHL"
                                    width={60}
                                    height={20}
                                    className="object-contain"
                                />
                            </div>
                            <div className="bg-gray-900 p-2 rounded border border-gray-800 flex items-center justify-center">
                                <img
                                    src="/fedex.png"
                                    alt="FedEx"
                                    width={60}
                                    height={20}
                                    className="object-contain"
                                />
                            </div>
                            <div className="bg-gray-900 p-2 rounded border border-gray-800 flex items-center justify-center">
                                <img
                                    src="/ups.png"
                                    alt="UPS"
                                    width={60}
                                    height={20}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bas de page */}
            <div className="border-t border-gray-800 bg-black">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-400 mb-4 md:mb-0">© {currentYear} PandaStore. Tous droits réservés.</div>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <Link to="#" className="text-gray-400 hover:text-white hover:underline">
                                Politique de confidentialité
                            </Link>
                            <Link to="#" className="text-gray-400 hover:text-white hover:underline">
                                Conditions d'utilisation
                            </Link>
                            <Link to="#" className="text-gray-400 hover:text-white hover:underline">
                                Politique d'expédition
                            </Link>
                            <Link to="#" className="text-gray-400 hover:text-white hover:underline">
                                Politique de remboursement
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
