import {  Home, LogOut, MessageSquareQuote, Settings, User } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';

const Navbar = () => {
  const {logout, authUser} = useAuthStore();
  return (
    <div className='flex items-center justify-between h-14 bg-blue-500 shadow-blue-100 shadow-xl'>
      <div className='p-4 flex items-center gap-2'style={{ padding: '20px' }}>
      <MessageSquareQuote  className='text-white font-bold flex items-center justify-center bg-blue-400 rounded-md' style={{ padding: '3px' }} />
      <Link to="/"><h1 className='text-2xl text-white font-bold flex'> <p className='text-amber-300'>R</p>chat</h1></Link>
      </div>
      <div style={{ padding: '20px' }}>
        <ul className='text-white font-bold flex items-center gap-4 cursor-pointer'>
        {authUser && (
          <>
                  <Link to="/profile">
                  
                  <div className='flex justify-between items-center gap-2'>
          <img 
            src={authUser?.profilePic || "/avatar.png"} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="text-lg font-semibold">{authUser?.fullName || "John Doe"}</p>
                  </div>
                  </Link>
                  <li onClick={logout} ><LogOut/> </li>
          </>
        )}
        </ul>
      </div>
    </div>
  )
}

export default Navbar