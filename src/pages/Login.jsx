import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value;
    const password = e.target[1].value;
    // see screen shot-> if didnt initialise auth->400 bad request
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  }

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>Testpage</span>
        <span className='title'>Login</span>
        <form onSubmit={handleSubmit}>

          <input type="email" placeholder='email' />
          <input type="password" placeholder='password' />

          <button>Sign in</button>
          {err && <span>Somthing went wrong...</span>}
        </form>
        <p>You do have an account? <Link to="/register">Register</Link> </p>
      </div>
    </div>
  )
}
