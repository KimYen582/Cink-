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
            <Title text1="Danh sách" text2="Đặt vé" />
            <div className="max-w-4xl mt-6 overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
                    <thead>
                        <tr className="bg-primary/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">Người dùng</th>
                            <th className="p-2 font-medium">Tên Phim</th>
                            <th className="p-2 font-medium">Thời gian chiếu</th>
                            <th className="p-2 font-medium">Ghế</th>
                            <th className="p-2 font-medium">Tổng tiền</th>
                            <th className="p-2 font-medium">Trạng thái</th>
                            <th className="p-2 font-medium">Thao tác</th>
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
                                <td className="p-2"><select value={item.status} onChange={(event) => changeStatus(item._id, event.target.value)} className="bg-black/20 border border-white/10 rounded px-2 py-1"><option value="pending">Chờ xử lý</option><option value="confirmed">Đã xác nhận</option><option value="cancelled">Đã hủy</option><option value="expired">Hết hạn</option></select></td>
                                <td className="p-2">{deleteId === item._id ? <><button type="button" title="Xác nhận xóa" onClick={() => remove(item._id)} className="p-2 text-red-400"><CheckIcon size={16} /></button><button type="button" title="Hủy xóa" onClick={() => setDeleteId(null)} className="p-2"><XIcon size={16} /></button></> : <button type="button" title="Xóa" onClick={() => setDeleteId(item._id)} className="p-2 text-red-400"><Trash2Icon size={16} /></button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />;
};

export default ListBookings;