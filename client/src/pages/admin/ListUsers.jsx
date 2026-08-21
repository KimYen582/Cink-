import React, { useEffect, useState } from 'react';
import { CheckIcon, EditIcon, SaveIcon, Trash2Icon, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { deleteUser, getUsers, updateUser } from '../../services/adminService';

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', role: 'user' });
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const loadUsers = async () => { try { setUsers(await getUsers()); } catch (error) { toast.error(error.message); } finally { setLoading(false); } };
    useEffect(() => { loadUsers(); }, []);
    const startEdit = (user) => { setEditingId(user._id); setForm({ name: user.name, email: user.email, role: user.role }); };
    const save = async (id) => { try { await updateUser(id, form); toast.success('User updated'); setEditingId(null); await loadUsers(); } catch (error) { toast.error(error.message); } };
    const remove = async (id) => { try { await deleteUser(id); toast.success('User deleted'); await loadUsers(); } catch (error) { toast.error(error.message); } };
    if (loading) return <Loading />;
    return <div><Title text1="Quản lý" text2="Người dùng" /><div className="mt-6 overflow-x-auto"><table className="w-full max-w-5xl text-left text-sm"><thead><tr className="bg-primary/20"><th className="p-3">Tên</th><th className="p-3">Email</th><th className="p-3">Vai trò</th><th className="p-3">Thao tác</th></tr></thead><tbody>{users.map((user) => <tr key={user._id} className="border-b border-white/10"><td className="p-3">{editingId === user._id ? <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="px-2 py-1 rounded bg-black/20 border border-white/10" /> : user.name}</td><td className="p-3">{editingId === user._id ? <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="px-2 py-1 rounded bg-black/20 border border-white/10" /> : user.email}</td><td className="p-3">{editingId === user._id ? <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="px-2 py-1 rounded bg-black/20 border border-white/10"><option value="user">Người dùng</option><option value="admin">Quản trị viên</option></select> : user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</td><td className="p-3 flex gap-2">{editingId === user._id ? <><button type="button" title="Lưu" onClick={() => save(user._id)} className="p-2 text-green-400"><SaveIcon size={17} /></button><button type="button" title="Hủy" onClick={() => setEditingId(null)} className="p-2 text-gray-400"><XIcon size={17} /></button></> : deleteId === user._id ? <><button type="button" title="Xác nhận xóa" onClick={() => remove(user._id)} className="p-2 text-red-400"><CheckIcon size={17} /></button><button type="button" title="Hủy xóa" onClick={() => setDeleteId(null)} className="p-2 text-gray-400"><XIcon size={17} /></button></> : <><button type="button" title="Sửa" onClick={() => startEdit(user)} className="p-2 text-blue-400"><EditIcon size={17} /></button><button type="button" title="Xóa" onClick={() => setDeleteId(user._id)} className="p-2 text-red-400"><Trash2Icon size={17} /></button></>}</td></tr>)}</tbody></table></div></div>;
};
export default ListUsers;
