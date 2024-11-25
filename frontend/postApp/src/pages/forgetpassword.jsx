import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api-client'
import { useAppStore } from '../store';
import { RECOVER_PASSWORD } from '../utils/constants'
import { toast } from "sonner";



const Login = () => {
    const navigate = useNavigate();

    const { userInfo, setuserInfo } = useAppStore();
    const [email, setemail] = useState("")
    const [newPassword, setnewPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")


    const validatelogin = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!newPassword.length) {
            toast.error("Password is required");
            return false;
        }
        if (!confirmPassword.length) {
            toast.error("Confirm password is required");
            return false;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New Password and Confirm Password do not match");
            return false;
        }
    
        return true;
    };
    

    const HandleLogin = async () => {
        if (validatelogin(email, newPassword, confirmPassword)) {
            try {
                const response = await apiClient.post(RECOVER_PASSWORD, { email, newPassword, confirmPassword });
                console.log("Full response:", response);
    
                if (response.data && response.data.message === 'Password reset successfully.') {
                    toast.success("Password reset successfully. Please log in with your new password.");
                    navigate('/login'); // Redirect to login page or any relevant page
                } else {
                    toast.error("Unexpected response from the server.");
                }
            } catch (error) {
                console.error("Error during API call:", error.response ? error.response.data : error.message);
                toast.error(error.response?.data?.message || "An error occurred. Please try again.");
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
                        value={newPassword}
                        onChange={(e) => setnewPassword(e.target.value)}
                        className='px-3 py-2 rounded w-full my-3 bg-gray-700'
                    />
                    <input
                        placeholder='Confirm Password'
                        name='password'
                        value={confirmPassword}
                        onChange={(e) => setconfirmPassword(e.target.value)}
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