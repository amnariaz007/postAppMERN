import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {apiClient} from '../lib/api-client'
import { useAppStore } from '../store';
import {SINGUP_ROUTE} from '../utils/constants'



const Signup = () => {
 
    const navigate = useNavigate();
    const { userInfo ,setuserInfo} = useAppStore();
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [fullname, setfullname] = useState("")

    const validatesingup = () => {
        if (!fullname.length ) {
            toast.error("fullname doesn't match");
            return false;
          }
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

      const HandleSignup = async () => {
        if (validatesingup()) {
          const response = await apiClient.post(SINGUP_ROUTE, { fullname, email, password })
          console.log({ response });
          if (response.status === 200) {
            setuserInfo(response.data.user)
            navigate('/Login');
          }
    
        }
      }

      useEffect(() => {
        console.log("Current userInfo:", userInfo); // Check userInfo on each change
      }, [userInfo]);


 


  return (
    <>

      <div className='top-0 left-0 flex items-center justify-center h-screen w-full'>
        <div className='w-2/6 bg-gray-900 p-4 rounded'>

          <input
            type='text'
            placeholder='fullname'
            name='fullname'
            value={fullname}
            onChange={(e)=> setfullname(e.target.value)}
            className='px-3 py-2 rounded w-full my-3 bg-gray-700'
          />

          <input
            type='text'
            placeholder='Email'
            name='email'
            value={email}
            onChange={(e)=> setemail(e.target.value)}
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
            <button onClick={HandleSignup} className='bg-slate-500 rounded p-2 '> Signup </button>
            <Link to="/Login" > Already have an account, login here!</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup