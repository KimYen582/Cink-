import React, { useEffect, useState } from 'react';
import { CheckIcon, EditIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { createMovie, deleteMovie, getMovies, updateMovie } from '../../services/adminService';

const emptyMovie = {
    title: '', overview: '', poster_path: '', backdrop_path: '', release_date: '',
    original_language: 'en', tagline: '', runtime: 120, vote_average: 0,
};

const ListMovies = () => {
    const [movies, setMovies] = useState([]);
    const [form, setForm] = useState(emptyMovie);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const loadMovies = async () => {
        try { setMovies(await getMovies()); } catch (error) { toast.error(error.message); } finally { setLoading(false); }
    };
    useEffect(() => { loadMovies(); }, []);

    const startEdit = (movie) => {
        setEditingId(movie._id);
        setForm({ ...emptyMovie, ...movie });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const reset = () => { setEditingId(null); setForm(emptyMovie); };
    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form, runtime: Number(form.runtime), vote_average: Number(form.vote_average), genres: form.genres || [], casts: form.casts || [] };
            if (editingId) await updateMovie(editingId, payload); else await createMovie(payload);
            toast.success(editingId ? 'Movie updated' : 'Movie created'); reset(); await loadMovies();
        } catch (error) { toast.error(error.message); } finally { setSaving(false); }
    };
    const remove = async (id) => {
        try { await deleteMovie(id); toast.success('Movie deleted'); await loadMovies(); } catch (error) { toast.error(error.message); }
    };

    if (loading) return <Loading />;
    return <div>
        <Title text1="Manage" text2="Movies" />
        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl p-5 border border-white/10 rounded-xl bg-white/[0.03]">
            {['title', 'release_date', 'poster_path', 'backdrop_path', 'original_language', 'runtime', 'vote_average'].map((field) => (
                <input key={field} required={['title', 'release_date', 'poster_path', 'backdrop_path', 'runtime', 'vote_average'].includes(field)} type={['runtime', 'vote_average'].includes(field) ? 'number' : field === 'release_date' ? 'date' : 'text'} value={form[field]} placeholder={field.replace('_', ' ')} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="px-3 py-2 rounded border border-white/10 bg-black/20 outline-none" />
            ))}
            <input value={form.tagline} placeholder="tagline" onChange={(event) => setForm({ ...form, tagline: event.target.value })} className="px-3 py-2 rounded border border-white/10 bg-black/20 outline-none" />
            <textarea required value={form.overview} placeholder="overview" onChange={(event) => setForm({ ...form, overview: event.target.value })} className="md:col-span-2 px-3 py-2 rounded border border-white/10 bg-black/20 outline-none min-h-20" />
            <div className="md:col-span-2 flex gap-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded text-white"><PlusIcon size={16} />{editingId ? 'Update movie' : 'Create movie'}</button>
                {editingId && <button type="button" onClick={reset} className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 rounded"><XIcon size={16} />Cancel</button>}
            </div>
        </form>
        <div className="mt-6 overflow-x-auto"><table className="w-full max-w-5xl text-left text-sm">
            <thead><tr className="bg-primary/20"><th className="p-3">Movie</th><th className="p-3">Release</th><th className="p-3">Runtime</th><th className="p-3">Actions</th></tr></thead>
            <tbody>{movies.map((movie) => <tr key={movie._id} className="border-b border-white/10"><td className="p-3 flex items-center gap-3"><img src={movie.poster_path} alt="" className="w-10 h-14 object-cover rounded" />{movie.title}</td><td className="p-3">{movie.release_date}</td><td className="p-3">{movie.runtime} min</td><td className="p-3 flex gap-2">{deleteId === movie._id ? <><button type="button" title="Confirm delete" onClick={() => remove(movie._id)} className="p-2 text-red-400"><CheckIcon size={17} /></button><button type="button" title="Cancel delete" onClick={() => setDeleteId(null)} className="p-2 text-gray-400"><XIcon size={17} /></button></> : <><button type="button" title="Edit" onClick={() => startEdit(movie)} className="p-2 text-blue-400"><EditIcon size={17} /></button><button type="button" title="Delete" onClick={() => remove(movie._id)} className="p-2 text-red-400"><Trash2Icon size={17} /></button></>}</td></tr>)}</tbody>
        </table></div>
    </div>;
};

export default ListMovies;
