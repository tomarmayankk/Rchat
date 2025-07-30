import { LogOut } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';

const Navbar = () => {
  const {logout, authUser} = useAuthStore();
  return (
    <div className='flex items-center justify-between h-14 border-b border-gray-300 text-gray-900'>
      <div className='flex items-center gap-2'style={{ padding: '20px' }}>
      <Link to="/"><h1 className='text-2xl font-bold flex'>Rchat</h1></Link>
      </div>
    </div>
  )
}
export default Navbar