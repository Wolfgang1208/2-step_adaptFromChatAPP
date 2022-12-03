import React, { useContext, useState } from 'react'
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase"
import { async } from '@firebase/util';
import { AuthContext } from "../context/AuthContext"

// process:
// 1, handle search query db for username matching and display in search form
// 2, handle click on search form to create chats between cur-user and disnaed-user (if uid? : ), setDoc updateDoc in firebase firestore
// error catch: enabled
const Search = () => {
  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)
  const { currentUser } = useContext(AuthContext)

  const handleSearch = async () => {
    // beware about the database table name:
    const q = query(collection(db, "users"), where("displayName", "==", username));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  }

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) { }

    setUser(null);
    setUsername("")
  };

  return (
    <div className="search">
      <div className='searchFrom'>
        <input type="text" placeholder='Find a friend' onKeyDown={handleKey} onChange={(e) => setUsername(e.target.value)} value={username} />
      </div>
      {err && <span>Sorry, couldnt find user {username}...</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInf">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search