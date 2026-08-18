import React from 'react'
import { UserProfile } from '@clerk/clerk-react'
import BlurCircle from '../components/BlurCircle'

const Profile = () => {
  return (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 pb-20 min-h-screen animate-fade-in flex flex-col items-center'>
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />
      
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className='text-3xl font-bold'>Account Settings</h1>
        <p className='text-gray-500 mt-2'>Manage your profile, security, and preferences.</p>
      </div>

      <div className="flex justify-center w-full">
        {/* We use Clerk's pre-built gorgeous profile component */}
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl",
              navbar: "hidden md:block", 
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              profileSectionTitleText: "text-white",
              profileSectionContent: "text-gray-300",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-black/50 border-white/10 text-white",
              formButtonPrimary: "bg-primary hover:bg-primary-dull text-white",
              dividerLine: "bg-white/10",
              badge: "bg-primary/20 text-primary",
              userPreviewMainIdentifier: "text-white",
              userPreviewSecondaryIdentifier: "text-gray-400",
            }
          }}
        />
      </div>
    </div>
  )
}

export default Profile
