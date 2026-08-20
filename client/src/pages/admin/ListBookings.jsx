import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { deleteBooking, getBookings, updateBooking } from '../../services/adminService';
import { CheckIcon, Trash2Icon, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ListBookings = () => {
    const { currency } = useAppContext();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const getAllBookings = async () => {
        try {
            const data = await getBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeStatus = async (id, status) => {
        try { await updateBooking(id, { status }); toast.success('Booking updated'); await getAllBookings(); } catch (error) { toast.error(error.message); }
    };
    const remove = async (id) => {
        try { await deleteBooking(id); toast.success('Booking deleted'); await getAllBookings(); } catch (error) { toast.error(error.message); }
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
                            <th className="p-2 font-medium">Status</th>
                            <th className="p-2 font-medium">Actions</th>
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
                                <td className="p-2"><select value={item.status} onChange={(event) => changeStatus(item._id, event.target.value)} className="bg-black/20 border border-white/10 rounded px-2 py-1"><option value="pending">pending</option><option value="confirmed">confirmed</option><option value="cancelled">cancelled</option><option value="expired">expired</option></select></td>
                                <td className="p-2">{deleteId === item._id ? <><button type="button" title="Confirm delete" onClick={() => remove(item._id)} className="p-2 text-red-400"><CheckIcon size={16} /></button><button type="button" title="Cancel delete" onClick={() => setDeleteId(null)} className="p-2"><XIcon size={16} /></button></> : <button type="button" title="Delete" onClick={() => remove(item._id)} className="p-2 text-red-400"><Trash2Icon size={16} /></button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />;
};

export default ListBookings;