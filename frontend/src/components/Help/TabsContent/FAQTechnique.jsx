import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion'
import React from 'react'

const FAQTechnique = () => {

    const faqsTechnique = [
        {
            id: "tech-1",
            question: "Le site ne s'affiche pas correctement, que faire ?",
            answer: "Videz le cache de votre navigateur (Ctrl+F5 sur PC, Cmd+R sur Mac), vérifiez que JavaScript est activé, ou essayez avec un autre navigateur (Chrome, Firefox). Si le problème persiste, contactez-nous."
        },
        {
            id: "tech-2",
            question: "Comment réinitialiser mon mot de passe ?",
            answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Vous recevrez un lien par email pour le réinitialiser. Vérifiez vos spams si vous ne voyez pas notre email."
        },
        {
            id: "tech-3",
            question: "Je ne reçois pas l'email de confirmation de commande",
            answer: "Vérifiez vos spams et assurez-vous que notre adresse (no-reply@votreboutique.com) n'est pas bloquée. Vous pouvez aussi consulter votre commande dans votre espace client."
        },
        {
            id: "tech-4",
            question: "La page de paiement ne se charge pas",
            answer: "Désactivez temporairement votre VPN/antivirus, vérifiez que les bloqueurs de pubs sont désactivés, ou essayez avec un autre appareil. Le problème peut venir de votre connexion internet."
        },
        {
            id: "tech-5",
            question: "Comment mettre à jour mes informations personnelles ?",
            answer: "Connectez-vous à votre compte, allez dans 'Mon profil' et cliquez sur 'Modifier'. Les changements sont instantanés sauf pour l'email (nécessite une confirmation)."
        },
        {
            id: "tech-6",
            question: "Problème de connexion à mon compte",
            answer: "Assurez-vous d'utiliser le bon email/mot de passe. Si vous utilisez les réseaux sociaux pour vous connecter, vérifiez que le service (Google, Facebook) n'est pas en panne."
        },
        {
            id: "tech-7",
            question: "Le site est-il optimisé pour mobile ?",
            answer: "Oui, notre site est entièrement responsive. Si vous rencontrez des problèmes, mettez à jour votre navigateur ou téléchargez notre application mobile pour une meilleure expérience."
        },
        {
            id: "tech-8",
            question: "Que faire si un produit ne s'ajoute pas au panier ?",
            answer: "Cela peut être dû à un problème temporaire. Essayez d'actualiser la page, vérifiez que le produit est en stock, ou contactez notre support technique via le chat en direct."
        }
    ];
    return (
        <div className='mt-2 flex flex-col'>
            <h1 className='text-xl font-semibold'>Technique</h1>
            <div className='w-full flex flex-wrap gap-2'>
                <Accordion type="single" collapsible className="w-full shadow px-3 rounded">
                    {faqsTechnique.map((faq) => (
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

export default FAQTechnique