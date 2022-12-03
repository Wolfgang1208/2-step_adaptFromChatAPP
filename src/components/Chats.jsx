import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';

// fetch conversations
// 1, realtime snapshot(db,table,curr-user.uid)=>doc.data()=>setChats()=>chats=doc.data() from firebase db 
// 2, 
const Chats = () => {
  const [chats, setChats] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  // at the beginning no userid -> error page empty -> getChats then setChats
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data())
      });

      return () => {
        unsub();
      }
    }
    currentUser.uid && getChats();
  }, [currentUser.uid])

  // console.log(chats)

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  // console.log(Object.entries(chats));
  return (
    <div className='chats'>
      {/* passing chats to objects here, ?.map((chat)=>) means for each chats*/}
      {/* sort method to sort out messages in sidebar in time order */}
      {Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map((chat) => (
        <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInf">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Chats