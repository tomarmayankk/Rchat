import React from 'react'
import { useChatStore } from '../store/useChatStore'
import Sidebar from '../Components/Sidebar';
import NoChatSelected from '../Components/NoChatSelected';
import ChatContainer from '../Components/ChatContainer';

const HomePage = () => {
  const {selectedUser} = useChatStore();
  return (
    <div className='h-[638px] bg-blue-100'>
      <div className='flex items-center justify-center px-4' style={{paddingTop: "30px"}}>
        <div className='bg-blue-50 rounded-lg shadow-md w-full max-w-6xl h-[500px]'>
          <div className='flex justify-between h-full rounded-md overflow-hidden'>
            <Sidebar/>
            {!selectedUser? <NoChatSelected/> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage