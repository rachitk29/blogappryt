import React, {useState} from 'react';
import authService from '../appwrite/auth';
import { useNavigate, Link } from 'react-router-dom';
import {login} from '../store/authSlice';
import { Button, Input, Logo } from "./index"
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const create = async(data) => {
        setError("")
        try {
            const userData = authService.createAccount(data)
            if(userData){
                const userData = authService.getCurrentUser()
                if(userData) dispatch(login(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div></div>
  );
}

export default Signup;