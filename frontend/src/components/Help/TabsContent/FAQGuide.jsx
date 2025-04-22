import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion'
import React from 'react'

const FAQGuide = () => {

    const guideUtilisation = [
        {
            id: "guide-1",
            question: "Comment créer un compte ?",
            answer: "Cliquez sur 'Mon compte' puis 'Créer un compte'. Remplissez le formulaire avec votre email et un mot de passe, ou connectez-vous en 1 clic via Google/Facebook. Une confirmation par email vous sera envoyée."
        },
        {
            id: "guide-2",
            question: "Comment passer une commande ?",
            answer: "1) Ajoutez des articles à votre panier\n2) Cliquez sur 'Valider le panier'\n3) Choisissez votre mode de livraison\n4) Sélectionnez un moyen de paiement\n5) Confirmez la commande\nVous recevrez un email récapitulatif."
        },
        {
            id: "guide-3",
            question: "Comment suivre ma commande ?",
            answer: "Dans votre espace client, section 'Mes commandes', cliquez sur 'Suivre mon colis'. Le numéro de suivi est aussi inclus dans votre email de confirmation d'expédition."
        },
        {
            id: "guide-4",
            question: "Comment utiliser un code promo ?",
            answer: "Ajoutez vos articles au panier. Dans le récapitulatif, cliquez sur 'Ajouter un code promo' et saisissez votre code. La réduction s'appliquera immédiatement si le code est valide."
        },
        {
            id: "guide-5",
            question: "Comment créer une liste d'envies ?",
            answer: "Sur la fiche produit, cliquez sur l'icône cœur. Retrouvez toutes vos listes dans 'Mon compte' > 'Mes listes d'envies'. Vous pouvez les partager via les réseaux sociaux."
        },
        {
            id: "guide-6",
            question: "Comment modifier ou annuler une commande ?",
            answer: "Les commandes peuvent être modifiées ou annulées dans l'heure suivant la passation via 'Mes commandes'. Passé ce délai, contactez notre service client au plus vite."
        },
        {
            id: "guide-7",
            question: "Comment contacter le vendeur d'un produit ?",
            answer: "Sur la fiche produit, cliquez sur 'Poser une question au vendeur'. Vous pouvez aussi consulter les questions/réponses déjà publiées dans la section 'Avis clients'."
        },
        {
            id: "guide-8",
            question: "Comment fonctionne le programme de fidélité ?",
            answer: "Chaque euro dépensé = 1 point. Cumulez 100 points pour obtenir 10€ de réduction. Consultez votre solde dans 'Mon compte' > 'Mes points fidélité'."
        }
    ];
    return (
        <div className='mt-2 flex flex-col'>
            <h1 className='text-xl font-semibold'>Guide d'utilisation</h1>
            <div className='w-full flex flex-wrap gap-2'>
                <Accordion type="single" collapsible className="w-full shadow px-3 rounded">
                    {guideUtilisation.map((faq) => (
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

export default FAQGuide