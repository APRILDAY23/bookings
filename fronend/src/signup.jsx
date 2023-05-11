import {useState} from 'react'
import {Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

//Function Signup
function Signup() {
    //Navigating
    const navigate = useNavigate();

    //Declaring the Variables
    const [values, setValues] = useState({
        name: '',
        username: '',
        password: ''
      });
      
    //Handling input from the fourm
    const handleInput = (event) => {
       setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    };
      
    //Handling Submit from the Fourm
    const handleSubmit = async (event) => {
       event.preventDefault();
       axios.post('http://localhost:8081/signup', values)
       .then(res => {
         console.log(res);
         navigate('/dashboard');
        })
        .catch(err => console.log(err));
    };
        
    //HTML Code
    return(
        <>
                    <link
                href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"
                rel="stylesheet"
            />
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <h1 className="text-2xl font-bold mb-4">Create Account</h1>
                <p className="mb-4">Please create a account</p>
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="username"
                        >
                            Full Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="fullname"
                            type="text"
                            name='name'
                            placeholder="Full Name"
                            onChange={handleInput}
                        />
                    </div>
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
                            name='username'
                            placeholder="VID"
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
                            name='password'
                            placeholder="********"
                            onChange={handleInput}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign Up
                        </button>
                        <div className="mt-4 flex flex-col">
                            <a
                                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                href="/"
                            >
                                Login
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </>

    )
}

export default Signup;