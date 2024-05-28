import { useState, useEffect } from 'react';
import axios from 'axios';

const useSolPrice = () => {
    const [solPrice, setSolPrice] = useState<number>(0);

    useEffect(() => {
        const fetchSolPrice = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
                const price = response.data.solana.usd;
                setSolPrice(price);
            } catch (error) {
                console.error('Error fetching SOL price:', error);
                setSolPrice(0);
            }
        };

        fetchSolPrice();
    }, []);

    return solPrice;
};

export default useSolPrice;