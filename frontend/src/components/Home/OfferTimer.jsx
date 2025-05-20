import React, { useEffect, useState } from 'react';

const OfferTimer = ({ endDateString, className }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isActive, setIsActive] = useState(true);
    const [noEndDate, setNoEndDate] = useState(false);

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

    if (noEndDate) {
        return <div className={`bg-card/40 px-3 py-2 rounded-md text-center w-full ${className}`}>
            <div className="text-xs text-card mb-1">L'offre se termine dans :</div>
            <div className="flex justify-center gap-1 text-sm font-medium text-card">
                <div className="tabular-nums">-- j</div>
                <div>:</div>
                <div className="tabular-nums">-- h</div>
                <div>:</div>
                <div className="tabular-nums">-- m</div>
                <div>:</div>
                <div className="tabular-nums">-- s</div>
            </div>
        </div>;
    }

    if (!isActive) {
        return <div className="text-red-600 text-sm font-medium">Offer expired</div>;
    }

    return (
        <div className={`bg-card/40 px-3 py-2 rounded-md text-center w-full ${className}`}>
            <div className="text-xs text-card mb-1">L'offre se termine dans :</div>
            <div className="flex justify-center gap-1 text-sm font-medium text-card">
                <div className="tabular-nums">{formatNumber(timeLeft.days)}j</div>
                <div>:</div>
                <div className="tabular-nums">{formatNumber(timeLeft.hours)}h</div>
                <div>:</div>
                <div className="tabular-nums">{formatNumber(timeLeft.minutes)}m</div>
                <div>:</div>
                <div className="tabular-nums">{formatNumber(timeLeft.seconds)}s</div>
            </div>
        </div>
    );
};

export default OfferTimer;