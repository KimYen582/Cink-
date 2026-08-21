import React from 'react'
import BlurCircle from '../components/BlurCircle'
import { useAuth } from '../context/AuthContext'
import { UserIcon, MailIcon, ShieldIcon } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 pb-20 min-h-screen animate-fade-in flex flex-col items-center'>
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <div className="w-full max-w-xl text-center mb-10">
        <h1 className='text-3xl font-bold'>Account Settings</h1>
        <p className='text-gray-500 mt-2'>Your profile information</p>
      </div>

      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(17,17,27,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        }}
      >
        {/* Top gradient bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)' }} />

        <div className="p-8">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            {user?.image ? (
              <img src={user.image} alt={user?.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500/30" />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ring-4 ring-purple-500/30"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
              >
                {initials}
              </div>
            )}
            <h2 className="text-xl font-bold text-white mt-4">{user?.name || '—'}</h2>
            <span
              className={`mt-1 px-3 py-0.5 rounded-full text-xs font-semibold ${
                user?.role === 'admin'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {user?.role === 'admin' ? '⚡ Admin' : 'Member'}
            </span>
          </div>

          {/* Info fields */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="p-2.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <UserIcon size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Full Name</p>
                <p className="text-white font-medium">{user?.name || '—'}</p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="p-2.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <MailIcon size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                <p className="text-white font-medium">{user?.email || '—'}</p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="p-2.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <ShieldIcon size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Role</p>
                <p className="text-white font-medium capitalize">{user?.role || 'user'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
