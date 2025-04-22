import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion'
import React from 'react'

const FAQTabs = () => {

    const ecommerceFAQs = [
        {
            id: "item-1",
            question: "Comment suivre ma commande ?",
            answer: "Une fois votre commande expédiée, vous recevrez un numéro de suivi par email. Vous pouvez entrer ce numéro dans la section 'Suivi de commande' de notre site ou sur le site du transporteur (par exemple, DHL, FedEx)."
        },
        {
            id: "item-2",
            question: "Quels modes de paiement acceptez-vous ?",
            answer: "Nous acceptons les cartes de crédit/débit (Visa, MasterCard, Amex), PayPal, Apple Pay et les virements bancaires. Tous les paiements sont traités de manière sécurisée."
        },
        {
            id: "item-3",
            question: "Puis-je annuler ou modifier ma commande ?",
            answer: "Vous pouvez modifier/annuler votre commande dans l'heure suivant sa validation via votre tableau de bord. Passé ce délai, contactez immédiatement le support—nous essaierons d'aider si la commande n'a pas été expédiée."
        },
        {
            id: "item-4",
            question: "Quelle est votre politique de retour ?",
            answer: "Vous pouvez retourner les articles non utilisés dans un délai de 30 jours pour un remboursement complet. Initiez un retour via votre tableau de bord, et nous vous fournirons une étiquette de retour prépayée. Des exclusions s'appliquent (par exemple, articles personnalisés)."
        },
        {
            id: "item-5",
            question: "Combien de temps prend la livraison ?",
            answer: "La livraison standard prend 3 à 5 jours ouvrables (domestique) ou 7 à 14 jours (international). Des options express sont disponibles lors du paiement."
        },
        {
            id: "item-6",
            question: "Livrez-vous à l'international ?",
            answer: "Oui ! Nous livrons dans la plupart des pays. Les frais de livraison et les délais varient en fonction de la destination. Consultez les frais estimés lors du paiement."
        },
        {
            id: "item-7",
            question: "Mon code promo ne fonctionne pas. Que dois-je faire ?",
            answer: "Assurez-vous que le code est correctement saisi et qu'il n'a pas expiré. Certains codes sont spécifiques à des produits. Contactez le support si le problème persiste."
        },
        {
            id: "item-8",
            question: "Comment contacter le support client ?",
            answer: "Utilisez notre chat en direct 24/7, envoyez un email (support@votreboutique.com) ou appelez le +1 (555) 123-4567. Le temps de réponse est inférieur à 2 heures."
        }
    ];

    return (
        <div className='mt-2 flex flex-col'>
            <h1 className='text-xl font-semibold'>Compte</h1>
            <div className='w-full flex flex-wrap gap-2'>
                <Accordion type="single" collapsible className="w-full shadow px-3 rounded">
                    {ecommerceFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default FAQTabs