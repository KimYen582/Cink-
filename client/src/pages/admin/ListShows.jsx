import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAuth } from '@clerk/clerk-react';

const ListShows = () => {
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const { getToken } = useAuth();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try {
            const token = await getToken();
            const response = await fetch('http://localhost:3000/api/admin/shows', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch shows');
            setShows(data.shows || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllShows();
    }, []);

    return !loading ? (
        <>
            <Title text1="List" text2="Shows" />
            <div className="max-w-4xl mt-6 overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
                    <thead>
                        <tr className="bg-primary/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">Movie Name</th>
                            <th className="p-2 font-medium">Show Time</th>
                            <th className="p-2 font-medium">Total Bookings</th>
                            <th className="p-2 font-medium">Earnings</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-light">
                        {shows.map((show) => (
                            <tr key={show._id} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                                <td className="p-2 min-w-45 pl-5">{show.movie?.title || 'Unknown movie'}</td>
                                <td className="p-2">{dateFormat(show.showDateTime)}</td>
                                <td className="p-2">{Object.keys(show.occupiedSeats || {}).length}</td>
                                <td className="p-2">{currency} {Object.keys(show.occupiedSeats || {}).length * (show.showPrice || 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />;
};

export default ListShows;