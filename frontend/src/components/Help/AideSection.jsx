import React from 'react'
import AideCard from './AideCard'
import { Book, Headphones, HelpCircle, Users } from 'lucide-react'

const AideSection = () => {
  const cardsContent = [
    { icon: <HelpCircle />, text: "Questionns Fréquentes", par: "Trouver rapidement des réponses à vos questions", takeTo: "/aide/FAQ" },
    { icon: <Headphones />, text: "Contacter le support", par: "Notre équipe est disponible pour vous aider" },
    { icon: <Book />, text: "Guides et tutoriels", par: "Apprenez à utiliser nos services" },
    { icon: <Users />, text: "Forums Communautaires", par: "Echangez avec d'autres utilisateurs" },
  ]

  // console.log(cardsContent)
  return (
    <div className='w-full flex flex-col'>
      <div className='w-full flex flex-wrap gap-5'>
        {
          cardsContent && cardsContent.map((card, index) => (
            <AideCard key={index} takeTo={card.takeTo} icon={card.icon} par={card.par} text={card.text} />
          ))
        }
      </div>
    </div>
  )
}

export default AideSection