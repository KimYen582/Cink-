import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon, FilmIcon, UsersIcon } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminSidebar = () => {

    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: assets.profile,
    }

    const adminNavlinks = [
        { name: 'Bảng điều khiển', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Tạo Lịch chiếu', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'Danh sách Lịch chiếu', path: '/admin/list-shows', icon: ListIcon },
        { name: 'Danh sách Đặt vé', path: '/admin/list-bookings', icon: ListCollapseIcon },
        { name: 'Quản lý Phim', path: '/admin/list-movies', icon: FilmIcon },
        { name: 'Quản lý Người dùng', path: '/admin/list-users', icon: UsersIcon },
    ]

    return (
        <div className='h-[calc(100vh-64px)] md:flex flex-col pt-8 max-w-[80px] md:max-w-[260px] w-full border-r border-white/10 bg-white/[0.02] backdrop-blur-xl text-sm transition-all duration-300 relative z-20'>
            {/* User Profile Area */}
            <div className='flex items-center gap-4 px-4 md:px-8 mb-8'>
                <div className='relative'>
                    <img className='h-10 md:h-12 w-10 md:w-12 rounded-full object-cover ring-2 ring-primary/50' src={user.imageUrl} alt="sidebar" />
                    <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#09090b]' />
                </div>
                <div className='max-md:hidden flex-col flex'>
                    <span className='font-bold text-white text-base tracking-wide'>{user.firstName} {user.lastName}</span>
                    <span className='text-xs text-primary font-medium'>Superadmin</span>
                </div>
            </div>
            
            {/* Navigation Links */}
            <div className='w-full flex flex-col gap-2 px-3 md:px-4'>
                {adminNavlinks.map((link, index) => (
                    <NavLink 
                        key={index} 
                        to={link.path} 
                        end 
                        className={({ isActive }) => `
                            relative flex items-center max-md:justify-center gap-4 w-full py-3.5 md:px-4 rounded-xl transition-all duration-300 group
                            ${isActive ? 'bg-primary/10 text-white shadow-[inset_0_0_20px_rgba(225,29,72,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active Indicator Glow */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-md shadow-[0_0_15px_rgba(225,29,72,0.8)]" />
                                )}
                                
                                <link.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                                <span className={`max-md:hidden font-medium tracking-wide ${isActive ? 'text-white' : ''}`}>{link.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default AdminSidebar