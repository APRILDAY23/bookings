import { useState, useEffect } from "react";
import { useLocation, useParams } from 'react-router-dom';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

//Function Update/Edit
function Update() {
    //Getting Data from the URL Parameters
    const location = useLocation();
    const username = new URLSearchParams(location.search).get('username');

    //Declaring the Variables
    const[atcposition, setATCPosition] = useState('');
    const[date, setDate] = useState('');
    const[starttime, setStartTime] = useState('');
    const[endtime, setEndTime] = useState('');
    const {id} = useParams();
    const [loggedIn, setLoggedIn] = useState(false);

    //Navigating
    const navigate = useNavigate();

    //To check if the user is logged in or not
    useEffect(() => {
        const storedLoggedIn = localStorage.getItem("loggedIn");
        if (storedLoggedIn === "true") {
          setLoggedIn(true);
        } else {
          axios
          .get("http://localhost:8081/")
          .then((res) => {
                if (res.data.valid) {
                    setLoggedIn(true);
                    localStorage.setItem("loggedIn", "true");
                } else {
                    navigate("/");
                }
            })
            .catch((err) => console.log(err));
        }
    }, []);

    //Submit Function to Update Data
    function handleSubmit(event) {
        event.preventDefault();
        axios.put('http://localhost:8081/dashboard/bookings/update/'+id, {atcposition, date, starttime, endtime})
        .then(res => {
            console.log(res);
            navigate('/dashboard');
        })
        .catch(err => console.log(err))
    }

    //HTML Code
    return(
        <>
 <link
                href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"
                rel="stylesheet"
            />
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <h1 className="text-2xl font-bold mb-4">Update Booking</h1>
                <p className="mb-4">Update your ATC Booking</p>
                <form onSubmit={handleSubmit} >
                    <div className="mb-4">
                    <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="username"
                        >
                            Details
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="fullname"
                            type="text"
                            name='fullname'
                            value={`${username}`} // set the value to include the username
                            readOnly
                        />
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="username"
                        >
                            ATC Position
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="atcposition"
                            type="text"
                            placeholder="ATC Position"
                            onChange={e => setATCPosition(e.target.value)}
                            name='atcposition'
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="password"
                        >
                            Date
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="date"
                            type="date"
                            name='date'
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="password"
                        >
                            Start Time
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="start_time"
                            type="time"
                            name='start_time'
                            onChange={e => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="password"
                        >
                            End Time
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="end_time"
                            type="time"
                            name='end_time'
                            onChange={e => setEndTime(e.target.value)}
                        />
                    </div>
                    <div className=" items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                                                    >
                        Update Booking                        
                        </button>
                    </div>
                </form>
            </div>        </>
    )

}
export default Update;