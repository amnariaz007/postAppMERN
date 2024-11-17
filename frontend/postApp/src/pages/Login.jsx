import React, { useState , useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {apiClient} from '../lib/api-client'
import { useAppStore } from '../store';
import {LOGIN_ROUTE} from '../utils/constants'


const Login = () => {
  const navigate = useNavigate();
  
  const { userInfo ,setuserInfo} = useAppStore();
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")




  const validatelogin = () => {
    if (!email.length) {
      toast.error("email is required");
      return false;
    }
    if (!password.length) {
      toast.error("password is required");
      return false;
    }
    return true;
  }
  const HandleLogin = async () => {
    if (validatelogin()) {
      const response = await apiClient.post(LOGIN_ROUTE, { email, password });
      console.log("Full response:", response); // Check the full response
  
      // Check if the response includes `id` and `token`
      if (response.data && response.data.id && response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
  
        // Set the entire response.data as userInfo
        setuserInfo(response.data);
        setTimeout(() => {
          console.log("Updated userInfo after login:", useAppStore.getState().userInfo);
          navigate('/');
        }, 100); // Optional delay
      } else {
        console.error("Login failed or unexpected response structure:", response.data);
      }
    }
  };
  



  useEffect(() => {
    console.log("Current userInfo:", userInfo); // Check userInfo on each change
  }, [userInfo]);


  


  return (
    <>

      <div className='top-0 left-0 flex items-center justify-center h-screen w-full'>
        <div className='w-2/6 bg-gray-900 p-4 rounded'>

          <input
            type='text'
            placeholder='Email'
            name='email'
            value={email}
            onChange={(e)=>setemail(e.target.value)}
            className='px-3 py-2 rounded w-full bg-gray-700'
          />
          <input

            placeholder='Password'
            name='password'
            value={password}
            onChange={(e)=> setpassword(e.target.value)}
            className='px-3 py-2 rounded w-full my-3 bg-gray-700'
          />
          <div className='w-full flex items-center justify-between'>
            <button onClick={HandleLogin} className='bg-slate-500 rounded p-2 '> Login </button>
            <Link to="/Signup" > Don't have an account, Signup here!</Link>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login