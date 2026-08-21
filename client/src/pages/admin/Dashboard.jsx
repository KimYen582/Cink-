import React, { useState, useEffect } from 'react';
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UsersIcon, StarIcon, Clock, Calendar } from 'lucide-react';
import Loading from "../../components/Loading";
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import timeFormat from '../../lib/timeFormat';
import { useAppContext } from '../../context/AppContext';
import { getDashboard } from '../../services/adminService';

const Dashboard = () => {
    const { currency } = useAppContext();

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0,
    });

    const [loading, setLoading] = useState(true);

    const dashboardCards = [
        { title: 'Tổng Doanh Thu', value: `${currency}${dashboardData.totalRevenue?.toLocaleString() || 0}`, icon: CircleDollarSignIcon, color: 'text-green-500', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]', bg: 'bg-green-500/10' },
        { title: 'Tổng Số Vé', value: dashboardData.totalBookings || '0', icon: ChartLineIcon, color: 'text-primary', glow: 'shadow-[0_0_20px_rgba(225,29,72,0.3)]', bg: 'bg-primary/10' },
        { title: 'Lịch chiếu đang chạy', value: dashboardData.activeShows?.length || '0', icon: PlayCircleIcon, color: 'text-blue-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]', bg: 'bg-blue-500/10' },
        { title: 'Tổng Người Dùng', value: dashboardData.totalUser || '0', icon: UsersIcon, color: 'text-purple-500', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]', bg: 'bg-purple-500/10' },
    ];

    const fetchDashboardData = async () => {
        try {
            const data = await getDashboard();
            setDashboardData(data);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return !loading ? (
        <div className="animate-fade-in relative z-10">
            <BlurCircle top="-100px" right="-100px" />
            <div className="flex items-center justify-between mb-8">
                <Title text1="admin" text2="Tổng quan" />
            </div>

            {/* Glowing Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full stagger-children">
                {dashboardCards.map((card, index) => (
                    <div key={index} className="relative group overflow-hidden flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-xl hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
                        <div className="relative z-10">
                            <h1 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{card.title}</h1>
                            <p className="text-3xl font-bold text-white mt-2 tracking-tight">{card.value}</p>
                        </div>
                        <div className={`relative z-10 p-4 rounded-full ${card.bg} ${card.glow} group-hover:scale-110 transition-transform duration-300`}>
                            <card.icon className={`w-8 h-8 ${card.color}`} />
                        </div>
                        {/* subtle background glow on hover */}
                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${card.bg}`} />
                    </div>
                ))}
            </div>

            <div className="mt-14 mb-6 flex items-center justify-between">
                <p className="text-2xl font-bold tracking-tight">Lịch chiếu mới nhất</p>
            </div>
            
            {/* Elegant Active Shows Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 stagger-children">
                {dashboardData.activeShows?.map((show) => (
                    <div key={show._id} className="group flex bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(225,29,72,0.1)]">
                        {/* Poster */}
                        <div className="w-1/3 relative overflow-hidden">
                            <img src={show.movie?.poster_path} alt="" className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#09090b]/80" />
                        </div>
                        
                        {/* Info */}
                        <div className="w-2/3 p-4 md:p-5 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{show.movie?.title}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/20 text-primary uppercase rounded border border-primary/20 tracking-wider">
                                        {show.hall || 'Rạp A'}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400 font-medium bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                        <StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        {show.movie?.vote_average?.toFixed(1) || '0.0'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                                    <span className="text-xs text-gray-400">Giá vé</span>
                                    <span className="text-base font-bold text-white">{currency}{show.showPrice?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-400 px-1">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {dateFormat(show.showDateTime)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {timeFormat(show.movie?.runtime)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : <Loading />;
};

export default Dashboard;