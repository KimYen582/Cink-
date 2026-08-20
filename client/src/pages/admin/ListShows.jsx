import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { deleteShow, getShows, updateShow } from '../../services/adminService';
import { CheckIcon, EditIcon, SaveIcon, Trash2Icon, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ListShows = () => {
    const { currency } = useAppContext();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ showDateTime: '', showPrice: '', hall: '' });
    const [deleteId, setDeleteId] = useState(null);

    const getAllShows = async () => {
        try {
            const data = await getShows();
            setShows(data);
        } catch (error) {
            console.error('Failed to load shows:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllShows();
    }, []);

    const startEdit = (show) => {
        setEditingId(show._id);
        setForm({ showDateTime: new Date(show.showDateTime).toISOString().slice(0, 16), showPrice: show.showPrice, hall: show.hall || 'A' });
    };
    const save = async (id) => {
        try { await updateShow(id, { ...form, showPrice: Number(form.showPrice) }); toast.success('Show updated'); setEditingId(null); await getAllShows(); } catch (error) { toast.error(error.message); }
    };
    const remove = async (id) => {
        try { await deleteShow(id); toast.success('Show deleted'); await getAllShows(); } catch (error) { toast.error(error.message); }
    };

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
                            <th className="p-2 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-light">
                        {shows.map((show) => (
                            <tr key={show._id} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                                <td className="p-2 min-w-45 pl-5">{show.movie?.title || 'Unknown movie'}</td>
                                <td className="p-2">{editingId === show._id ? <input type="datetime-local" value={form.showDateTime} onChange={(event) => setForm({ ...form, showDateTime: event.target.value })} className="bg-black/20 border border-white/10 rounded px-2 py-1" /> : dateFormat(show.showDateTime)}</td>
                                <td className="p-2">{Object.keys(show.occupiedSeats || {}).length}</td>
                                <td className="p-2">{editingId === show._id ? <div className="flex gap-1"><input type="number" min="1" value={form.showPrice} onChange={(event) => setForm({ ...form, showPrice: event.target.value })} className="w-24 bg-black/20 border border-white/10 rounded px-2 py-1" /><input value={form.hall} onChange={(event) => setForm({ ...form, hall: event.target.value })} className="w-14 bg-black/20 border border-white/10 rounded px-2 py-1" /></div> : `${currency} ${Object.keys(show.occupiedSeats || {}).length * (show.showPrice || 0)}`}</td>
                                <td className="p-2 flex gap-1">{editingId === show._id ? <><button type="button" title="Save" onClick={() => save(show._id)} className="p-2 text-green-400"><SaveIcon size={16} /></button><button type="button" title="Cancel" onClick={() => setEditingId(null)} className="p-2"><XIcon size={16} /></button></> : deleteId === show._id ? <><button type="button" title="Confirm delete" onClick={() => remove(show._id)} className="p-2 text-red-400"><CheckIcon size={16} /></button><button type="button" title="Cancel delete" onClick={() => setDeleteId(null)} className="p-2"><XIcon size={16} /></button></> : <><button type="button" title="Edit" onClick={() => startEdit(show)} className="p-2 text-blue-400"><EditIcon size={16} /></button><button type="button" title="Delete" onClick={() => remove(show._id)} className="p-2 text-red-400"><Trash2Icon size={16} /></button></>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />;
};

export default ListShows;