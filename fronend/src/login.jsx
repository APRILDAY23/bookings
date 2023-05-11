import './login.css';
import { useState , useEffect } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

//Function Login
function Login() {
    //Navigating
    const navigate = useNavigate();

    //Declaring Variables
    const [values, setValues] = useState({
        username: '',
        password: ''
      });
      
    //Handling Input from the Form
    const handleInput = (event) => {
       setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    };
      
    axios.defaults.withCredentials = true;
      
    //Handling the Submit Button of the Fourm
    const handleSubmit = async (event) => {
       event.preventDefault();
       axios.post('http://localhost:8081/login', values)
        .then(res => {
           if (res.data.Login) {
              navigate('/dashboard');
            } else {
              alert("Account Not Found!");
            }
        })
          .catch(err => console.log(err));
    };
      
    //HTML Code  
    return (
        <>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"
                rel="stylesheet"
            />
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                <p className="mb-4">To access the IVAO Bookings Page, please log in</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="username"
                        >
                            VID
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="VID"
                            name='username'
                            onChange={handleInput}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="********"
                            name='password'
                            onChange={handleInput}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                                                    >
                            Log In
                        </button>
                        <div className=" flex flex-col">
                            <a
                                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                href="/signup"
                            >
                                Create Account
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;