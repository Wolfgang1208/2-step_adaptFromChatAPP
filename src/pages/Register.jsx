import React, { useState } from 'react'
import Add from "../img/addAvatar.png"
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../firebase'
import { async } from '@firebase/util'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate,Link } from 'react-router-dom'

export const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const phoneNumber = e.target[3].value;
    const file = e.target[4].files[0];
    
    // see screen shot-> if didnt initialise auth->400 bad request
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers
      uploadTask.on(
        (error) => {
          setErr(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            await updateProfile(res.user,{
              displayName,
              phoneNumber,
              photoURL: downloadURL,
            });
            await setDoc(doc(db,"users",res.user.uid),{
              uid: res.user.uid,
              displayName,
              email,
              phoneNumber,
              photoURL: downloadURL,
            });
            navigate("/")
          });
        }
      );

      
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>chatME</span>
        <span className='title'>Register here</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='display name' />
          <input type="email" placeholder='email' />
          <input type="password" placeholder='password' />
          <input type="phoneNumber" placeholder='phone number' />
          <input style={{ display: "none" }} type="file" name="" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="avatar" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
          {err && <span>Something went wrong...</span>}
        </form>
        <p>You do have an account? <Link to="/login">Login</Link>  </p>
      </div>
    </div>
  )
}
