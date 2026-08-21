import React, { useEffect, useState } from 'react';
import { CheckIcon, EditIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { createMovie, deleteMovie, getMovies, updateMovie } from '../../services/adminService';

const emptyMovie = {
    title: '', overview: '', poster_path: '', backdrop_path: '', release_date: '',
    original_language: 'en', tagline: '', runtime: 120, vote_average: 0,
    genres: [{ name: '' }],
    casts: [{ name: '', character: '' }]
};

const ListMovies = () => {
    const [movies, setMovies] = useState([]);
    const [form, setForm] = useState(emptyMovie);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const loadMovies = async () => {
        try { setMovies(await getMovies()); } 
        catch (error) { toast.error(error.message); } 
        finally { setLoading(false); }
    };
    
    useEffect(() => { loadMovies(); }, []);

    const startEdit = (movie) => {
        setEditingId(movie._id);
        const formattedDate = movie.release_date ? new Date(movie.release_date).toISOString().slice(0, 10) : '';
        setForm({ 
            ...emptyMovie, 
            ...movie, 
            release_date: formattedDate,
            genres: movie.genres?.length ? movie.genres : [{ name: '' }],
            casts: movie.casts?.length ? movie.casts : [{ name: '', character: '' }]
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const reset = () => { setEditingId(null); setForm(emptyMovie); };

    // --- Dynamic Handlers ---
    const handleGenreChange = (index, value) => {
        const newGenres = [...form.genres];
        newGenres[index] = { name: value };
        setForm({ ...form, genres: newGenres });
    };
    const addGenre = () => setForm({ ...form, genres: [...form.genres, { name: '' }] });
    const removeGenre = (index) => setForm({ ...form, genres: form.genres.filter((_, i) => i !== index) });

    const handleCastChange = (index, field, value) => {
        const newCasts = [...form.casts];
        newCasts[index] = { ...newCasts[index], [field]: value };
        setForm({ ...form, casts: newCasts });
    };
    const addCast = () => setForm({ ...form, casts: [...form.casts, { name: '', character: '' }] });
    const removeCast = (index) => setForm({ ...form, casts: form.casts.filter((_, i) => i !== index) });

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const cleanGenres = form.genres.filter(g => g.name.trim() !== '');
            const cleanCasts = form.casts.filter(c => c.name.trim() !== '' && c.character.trim() !== '');
            
            if (cleanGenres.length === 0) throw new Error("Vui lòng thêm ít nhất một thể loại.");
            if (cleanCasts.length === 0) throw new Error("Vui lòng thêm ít nhất một diễn viên.");

            const payload = { 
                ...form, 
                runtime: Number(form.runtime), 
                vote_average: Number(form.vote_average), 
                genres: cleanGenres, 
                casts: cleanCasts 
            };
            if (editingId) await updateMovie(editingId, payload); 
            else await createMovie(payload);
            
            toast.success(editingId ? 'Đã cập nhật phim' : 'Đã tạo phim'); 
            reset(); 
            await loadMovies();
        } catch (error) { 
            toast.error(error.message); 
        } finally { 
            setSaving(false); 
        }
    };

    const remove = async (id) => {
        try { 
            await deleteMovie(id); 
            toast.success('Đã xóa phim'); 
            await loadMovies(); 
        } catch (error) { toast.error(error.message); }
    };

    if (loading) return <Loading />;
    
    return (
        <div className="pb-10">
            <Title text1="Quản lý" text2="Phim" />
            
            <form onSubmit={submit} className="mt-6 max-w-5xl p-6 border border-white/10 rounded-2xl bg-white/[0.02] shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2">Thông tin cơ bản</h3>
                        
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Tựa đề *</label>
                            <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded border border-white/10 bg-black/30 outline-none text-white focus:border-purple-500 transition-colors" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Ngày phát hành *</label>
                                <input required type="date" value={form.release_date} onChange={(e) => setForm({ ...form, release_date: e.target.value })} className="w-full px-3 py-2 rounded border border-white/10 bg-black/30 outline-none text-white focus:border-purple-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Ngôn ngữ</label>
                                <input type="text" value={form.original_language} onChange={(e) => setForm({ ...form, original_language: e.target.value })} className="w-full px-3 py-2 rounded border border-white/10 bg-black/30 outline-none text-white focus:border-purple-500 transition-colors" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Thời lượng (phút) *</label>
                                <input required type="number" value={form.runtime} onChange={(e) => setForm({ ...form, runtime: e.target.value })} className="w-full px-3 py-2 rounded border border-white/10 bg-black/30 outline-none text-white focus:border-purple-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Điểm đánh giá *</label>
                                <input required type="number" step="0.1" max="10" value={form.vote_average} onChange={(e) => setForm({ ...form, vote_average: e.target.value })} className="w-full px-3 py-2 rounded border border-white/10 bg-black/30 outline-none text-white focus:border-purple-500 transition-colors" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Tagline</label>
                            <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full px-3 py-2 rounded border border-white/10 bg-black/30 outline-none text-white focus:border-purple-500 transition-colors" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Tổng quan *</label>
                            <textarea required value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} className="w-full px-3 py-2 rounded border border-white/10 bg-black/30 outline-none min-h-[100px] text-white focus:border-purple-500 transition-colors" />
                        </div>
                    </div>

                    {/* Media & Relations */}
                    <div className="space-y-4 flex flex-col">
                        <h3 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2">Media & Chi tiết</h3>
                        
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">URL Poster *</label>
                            <input required type="url" value={form.poster_path} onChange={(e) => setForm({ ...form, poster_path: e.target.value })} className="w-full px-3 py-2 rounded border border-white/10 bg-black/30 outline-none text-white focus:border-purple-500 transition-colors" />
                        </div>
                        
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">URL Backdrop *</label>
                            <input required type="url" value={form.backdrop_path} onChange={(e) => setForm({ ...form, backdrop_path: e.target.value })} className="w-full px-3 py-2 rounded border border-white/10 bg-black/30 outline-none text-white focus:border-purple-500 transition-colors" />
                        </div>

                        {/* Genres */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Thể loại *</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.genres.map((genre, idx) => (
                                    <div key={idx} className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-full px-3 py-1">
                                        <input 
                                            type="text" 
                                            placeholder="Hành động" 
                                            value={genre.name} 
                                            onChange={(e) => handleGenreChange(idx, e.target.value)} 
                                            className="bg-transparent outline-none w-24 text-sm text-white"
                                        />
                                        {form.genres.length > 1 && (
                                            <button type="button" onClick={() => removeGenre(idx)} className="text-gray-400 hover:text-red-400"><XIcon size={14} /></button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addGenre} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                                    <PlusIcon size={12} /> Thêm
                                </button>
                            </div>
                        </div>

                        {/* Casts */}
                        <div className="flex-1 flex flex-col">
                            <label className="block text-sm text-gray-400 mb-2">Diễn viên *</label>
                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                {form.casts.map((cast, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Tên diễn viên" 
                                            value={cast.name} 
                                            onChange={(e) => handleCastChange(idx, 'name', e.target.value)} 
                                            className="flex-1 px-3 py-1.5 rounded border border-white/10 bg-black/30 outline-none text-sm text-white focus:border-purple-500 transition-colors"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Nhân vật" 
                                            value={cast.character} 
                                            onChange={(e) => handleCastChange(idx, 'character', e.target.value)} 
                                            className="flex-1 px-3 py-1.5 rounded border border-white/10 bg-black/30 outline-none text-sm text-white focus:border-purple-500 transition-colors"
                                        />
                                        {form.casts.length > 1 && (
                                            <button type="button" onClick={() => removeCast(idx)} className="text-gray-400 hover:text-red-400 p-1 bg-white/5 rounded transition-colors"><XIcon size={16} /></button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addCast} className="mt-2 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded transition-colors flex items-center gap-1 self-start">
                                <PlusIcon size={14} /> Thêm diễn viên
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex gap-3">
                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-50">
                        <PlusIcon size={18} />
                        {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật Phim' : 'Tạo Phim')}
                    </button>
                    {editingId && (
                        <button type="button" onClick={reset} className="inline-flex items-center gap-2 border border-white/10 hover:bg-white/5 px-6 py-2.5 rounded-lg text-white font-medium transition-colors">
                            <XIcon size={18} /> Hủy Sửa
                        </button>
                    )}
                </div>
            </form>
            
            {/* Movies Table */}
            <div className="mt-8 overflow-x-auto border border-white/10 rounded-xl bg-white/[0.02]">
                <table className="w-full max-w-5xl text-left text-sm">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                            <th className="p-4 font-medium">Tên phim</th>
                            <th className="p-4 font-medium">Phát hành</th>
                            <th className="p-4 font-medium">Thời lượng</th>
                            <th className="p-4 font-medium">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie) => (
                            <tr key={movie._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 flex items-center gap-4">
                                    <img src={movie.poster_path} alt="" className="w-12 h-16 object-cover rounded shadow-md" />
                                    <div>
                                        <div className="font-medium text-white">{movie.title}</div>
                                        <div className="text-xs text-gray-500 truncate w-48 mt-1">{movie.tagline || 'Không có tagline'}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-300">
                                    {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="p-4 text-gray-300">
                                    {movie.runtime} min
                                </td>
                                <td className="p-4 flex gap-2 items-center h-full pt-6">
                                    {deleteId === movie._id ? (
                                        <div className="flex gap-1 bg-red-950/40 p-1 rounded border border-red-900/50">
                                            <button type="button" title="Xác nhận xóa" onClick={() => remove(movie._id)} className="p-1.5 text-red-400 hover:bg-red-900/50 rounded transition-colors"><CheckIcon size={16} /></button>
                                            <button type="button" title="Hủy xóa" onClick={() => setDeleteId(null)} className="p-1.5 text-gray-400 hover:bg-white/10 rounded transition-colors"><XIcon size={16} /></button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-1">
                                            <button type="button" title="Sửa" onClick={() => startEdit(movie)} className="p-2 text-blue-400 hover:bg-blue-900/30 rounded transition-colors"><EditIcon size={16} /></button>
                                            <button type="button" title="Xóa" onClick={() => setDeleteId(movie._id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded transition-colors"><Trash2Icon size={16} /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListMovies;
