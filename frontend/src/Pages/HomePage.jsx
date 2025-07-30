import React from 'react'
import { useChatStore } from '../store/useChatStore'
import Sidebar from '../Components/Sidebar';
import NoChatSelected from '../Components/NoChatSelected';
import ChatContainer from '../Components/ChatContainer';

const HomePage = () => {
  const {selectedUser} = useChatStore();
  return (

          <div className='flex justify-between h-[100vh-20px] rounded-md overflow-hidden gap-2 bg-gray-50'style={{ height: 'calc(100vh - 60px)', padding: '2rem' }}>
            <Sidebar/>
            {!selectedUser? <NoChatSelected/> : <ChatContainer />}
          </div>
  )
}

export default HomePage
