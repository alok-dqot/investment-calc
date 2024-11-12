import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '7Q3DIT5V0R1R0UYB'; // Your Alpha Vantage API Key

const StockCards: React.FC = () => {
    const [topGainers, setTopGainers] = useState<any[]>([]);
    const [topLosers, setTopLosers] = useState<any[]>([]);
    const [topActivelyTraded, setTopActivelyTraded] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch data for Top Gainers, Top Losers, and Top Actively Traded
    useEffect(() => {
        const fetchStockData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://www.alphavantage.co/query', {
                    params: {
                        function: 'TOP_GAINERS_LOSERS',
                        apikey: API_KEY,
                    },
                });

                const data = response.data;

                // Assuming API response matches the structure you've provided
                setTopGainers(data['top_gainers'] || []);
                setTopLosers(data['top_losers'] || []);
                setTopActivelyTraded(data['most_actively_traded'] || []);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const renderStockCard = (stock: any) => (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
            <div className="px-6 py-4">
                {/* <img src={`https://financialmodelingprep.com/image-stock/${stock.ticker}`} alt={`${stock.ticker} Logo`} className="w-12 h-12 mb-4 rounded-full mx-auto" /> */}
                <h2 className="font-bold text-xl mb-2">{stock.ticker}</h2>
                <p className="text-gray-500">Price: ${stock.price}</p>
                <p className={`mt-2 text-lg ${parseFloat(stock.change_amount) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <strong>{parseFloat(stock.change_amount) >= 0 ? '▲' : '▼'} {stock.change_amount} ({stock.change_percentage})</strong>
                </p>
                <p className="text-gray-500">Volume: {stock.volume}</p>
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl text-center mt-10">Stock Data Cards</h1>

            {/* Top Gainers Section */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold text-center mb-6">Top Gainers</h2>
                <div className="flex flex-wrap justify-center">
                    {topGainers.map((stock, index) => renderStockCard(stock))}
                </div>
            </div>

            {/* Top Losers Section */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold text-center mb-6">Top Losers</h2>
                <div className="flex flex-wrap justify-center">
                    {topLosers.map((stock, index) => renderStockCard(stock))}
                </div>
            </div>

            {/* Top Actively Traded Section */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold text-center mb-6">Top Actively Traded Stocks</h2>
                <div className="flex flex-wrap justify-center">
                    {topActivelyTraded.map((stock, index) => renderStockCard(stock))}
                </div>
            </div>
        </div>
    );
};

export default StockCards;


const StockCard: React.FC<{ stock: any }> = ({ stock }) => {
    const logoUrl = `https://logo.clearbit.com/${stock.ticker.toLowerCase()}.com`;

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
            <div className="px-6 py-4">
                {/* Display logo */}
                <img src={logoUrl} alt={`${stock.ticker} Logo`} className="w-12 h-12 mb-4 rounded-full mx-auto" />
                <h2 className="font-bold text-xl mb-2">{stock.ticker}</h2>
                <p className="text-gray-500">Price: ${stock.price}</p>
                <p className={`mt-2 text-lg ${parseFloat(stock.change_amount) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <strong>{parseFloat(stock.change_amount) >= 0 ? '▲' : '▼'} {stock.change_amount} ({stock.change_percentage})</strong>
                </p>
                <p className="text-gray-500">Volume: {stock.volume}</p>
            </div>
        </div>
    );
};