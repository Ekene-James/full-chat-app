import React from 'react'
import { ChatContext } from '../../store/chats/ChatStore';
import ClearChats from './modalContents/ClearChats'
import DeleteChats from './modalContents/DeleteChats'
import Profile from './modalContents/Profile'

function ContentsContainer() {
    const chatCtx = React.useContext(ChatContext);
  const view = () => {
      switch (chatCtx.state.modal.active) {
        case 'Profile':
          return <Profile/>
        case 'Clear Chats':
          return <ClearChats/>
        case 'Delete Chats':
          return <DeleteChats/>
      
          
        default:
          return ''
      }
    }
  return (
    <>{view()}</>
  )
}

export default ContentsContainer