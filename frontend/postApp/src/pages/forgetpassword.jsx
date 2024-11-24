import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api-client'
import { useAppStore } from '../store';
import { LOGIN_ROUTE } from '../utils/constants'


const Login = () => {
    const navigate = useNavigate();

    const { userInfo, setuserInfo } = useAppStore();
    const [email, setemail] = useState("")
    const [newpassword, setnewpassword] = useState("")
    const [confirmnewpassword, setconfirmnewpassword] = useState("")




    const validatelogin = (email, newpassword, confirmpassword) => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!newpassword.length) {
            toast.error("Password is required");
            return false;
        }
        if (!confirmpassword.length) {
            toast.error("Confirm password is required");
            return false;
        }
        if (newpassword !== confirmpassword) {
            toast.error("New Password and Confirm Password do not match");
            return false;
        }
    
        return true;
    };
    

    const HandleLogin = async () => {
        if (validatelogin()) {
            const response = await apiClient.post(LOGIN_ROUTE, { email, password });
            console.log("Full response:", response);

            if (response.data && response.data.id && response.data.token) {

                localStorage.setItem('token', response.data.token);

                setuserInfo(response.data);
                setTimeout(() => {
                    console.log("Updated userInfo after login:", useAppStore.getState().userInfo);
                    navigate('/');
                }, 100);
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
                        onChange={(e) => setemail(e.target.value)}
                        className='px-3 py-2 rounded w-full bg-gray-700'
                    />
                    <input

                        placeholder='New Password'
                        name='password'
                        value={newpassword}
                        onChange={(e) => setnewpassword(e.target.value)}
                        className='px-3 py-2 rounded w-full my-3 bg-gray-700'
                    />
                    <input
                        placeholder='Confirm Password'
                        name='password'
                        value={confirmnewpassword}
                        onChange={(e) => setconfirmnewpassword(e.target.value)}
                        className='px-3 py-2 rounded w-full my-1 bg-gray-700'
                    />
                    <div className='w-full flex items-center justify-between'>
                        <button onClick={HandleLogin} className='bg-slate-500 rounded p-2 '> Reset Password  </button>
                        <Link to="/Signup" > Signup here!</Link>
                        <Link to="/forgetpassword" > forgot password </Link>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Login