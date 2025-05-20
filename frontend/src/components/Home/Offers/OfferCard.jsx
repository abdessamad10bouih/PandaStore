import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card'
import React, { useEffect, useState } from 'react'
import ProductCard from '../ProductCard';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { ArrowRight } from 'lucide-react';

const OfferCard = ({ post }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isActive, setIsActive] = useState(true);
    const [noEndDate, setNoEndDate] = useState(false);
    const endDateString = post.dateFin || null;

    useEffect(() => {
        if (!endDateString || endDateString === "0000-00-00T00:00:00Z" || endDateString === "") {
            setNoEndDate(true);
            setIsActive(false);
            return;
        }

        const endDate = new Date(endDateString);

        const calculateTimeLeft = () => {
            const difference = endDate.getTime() - new Date().getTime();
            if (difference <= 0) {
                setIsActive(false);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endDateString]);

    // Format number to always have two digits
    const formatNumber = (num) => {
        return num.toString().padStart(2, "0");
    };
    return (
        <Card className="w-full relative shadow-md rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/80 to-blue-700/80 px-10">
            <div
                className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 z-0"
                style={{
                    backgroundImage: `url(${post.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.8, // Adjust this value to control the overall background opacity
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-500 opacity-80"></div>
            </div>
            <div className="relative z-10">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h1 className="text-2xl font-bold text-card flex items-center gap-2">
                            Nos dernières offres{" "}
                            <span role="img" aria-label="celebration" className="text-yellow-400 text-2xl">
                                🎉
                            </span>
                        </h1>
                        <h1 className="text-xl text-white flex items-center justify-center gap-2">
                            Termine dans {" "}
                            <span className="font-bold tabular-nums flex items-center gap-2">
                                <LittleCard date={`${formatNumber(timeLeft.days)}j`} />
                                :
                                <LittleCard date={formatNumber(timeLeft.hours)} />
                                :
                                <LittleCard date={formatNumber(timeLeft.minutes)} />
                                :
                                <LittleCard date={formatNumber(timeLeft.seconds)} />
                            </span>
                        </h1>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-3">
                    {post.produits.length > 0 &&
                        post.produits.slice(0, 4).map((produit, index) => <ProductCard product={produit} key={index} />)}
                </CardContent>
                {post.produits.length > 0 && (
                    <CardFooter className="mt-4 flex items-center justify-center">
                        <Link to={`/posts/${post._id}`} className="w-fit flex justify-center items-center">
                            <Button className={'w-full h-12'}>
                                Voir les détails
                                <ArrowRight />
                            </Button>
                        </Link>
                    </CardFooter>
                )}
            </div>
        </Card>
    )
}

export default OfferCard


const LittleCard = ({ date }) => {
    return (
        <Card className="w-12 h-12 flex items-center justify-center">
            <h1 className='text-xl'>{date}</h1>
        </Card>
    )
}