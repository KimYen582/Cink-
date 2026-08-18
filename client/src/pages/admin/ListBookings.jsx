import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAuth } from '@clerk/clerk-react';

const ListBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const { getToken } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAllBookings = async () => {
        try {
            const token = await getToken();
            const response = await fetch('http://localhost:3000/api/admin/bookings', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch bookings');
            setBookings(data.bookings || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllBookings();
    }, []);

    return !isLoading ? (
        <>
            <Title text1="List" text2="Bookings" />
            <div className="max-w-4xl mt-6 overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
                    <thead>
                        <tr className="bg-primary/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">User Name</th>
                            <th className="p-2 font-medium">Movie Name</th>
                            <th className="p-2 font-medium">Show Time</th>
                            <th className="p-2 font-medium">Seats</th>
                            <th className="p-2 font-medium">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-light">
                        {bookings.map((item) => (
                            <tr key={item._id} className="border-b border-primary/20 bg-primary/5 even:bg-primary/10">
                                <td className="p-2 min-w-45 pl-5">{item.user}</td>
                                <td className="p-2">{item.movie}</td>
                                <td className="p-2">{item.showDateTime ? dateFormat(item.showDateTime) : 'N/A'}</td>
                                <td className="p-2">{(item.seats || []).join(', ') || 'N/A'}</td>
                                <td className="p-2">{currency} {item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />;
};

export default ListBookings;