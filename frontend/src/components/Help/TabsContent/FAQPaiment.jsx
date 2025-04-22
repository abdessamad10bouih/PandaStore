import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion'


const FAQPaiment = () => {
    const faqsPaiement = [
        {
            id: "paiement-1",
            question: "Quels modes de paiement acceptez-vous ?",
            answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, CB), PayPal, virements bancaires, et paiements en 3 ou 4 fois via Alma ou Klarna. Toutes les transactions sont sécurisées."
        },
        {
            id: "paiement-2",
            question: "Mon paiement a été refusé, que faire ?",
            answer: "Vérifiez que les informations de votre carte sont correctes et que votre plafond de paiement n'est pas atteint. Si le problème persiste, contactez votre banque ou essayez un autre moyen de paiement."
        },
        {
            id: "paiement-3",
            question: "Le paiement en plusieurs fois est-il possible ?",
            answer: "Oui ! Vous pouvez choisir le paiement en 3 ou 4 fois sans frais avec Alma ou Klarna lors du passage en caisse, sous réserve d'acceptation par notre partenaire financier."
        },
        {
            id: "paiement-4",
            question: "Est-ce que mes données bancaires sont sécurisées ?",
            answer: "Absolument. Nous utilisons un cryptage SSL et ne stockons jamais vos coordonnées bancaires. Les paiements sont traités par des plateformes certifiées (Stripe, PayPal, etc.)."
        },
        {
            id: "paiement-5",
            question: "Quand serai-je débité(e) ?",
            answer: "Pour les cartes bancaires, le montant est réservé à la commande et définitivement débité à l'expédition. Pour les paiements en plusieurs fois, la première échéance est prélevée immédiatement."
        },
        {
            id: "paiement-6",
            question: "Puis-je utiliser un code promo sur un paiement en plusieurs fois ?",
            answer: "Oui, tant que le code promo est valide et applicable à votre panier. La réduction sera répartie sur l'ensemble des échéances."
        },
        {
            id: "paiement-7",
            question: "Comment obtenir une facture ?",
            answer: "Votre facture est automatiquement générée après paiement et disponible dans votre espace client (section 'Mes commandes'). Vous pouvez aussi la demander par email à support@votreboutique.com."
        }
    ];

    return (
        <div className='mt-2 flex flex-col'>
            <h1 className='text-xl font-semibold'>Paiment</h1>
            <div className='w-full flex flex-wrap gap-2'>
                <Accordion type="single" collapsible className="w-full shadow px-3 rounded">
                    {faqsPaiement.map((faq) => (
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

export default FAQPaiment