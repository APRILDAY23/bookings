import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

  //Function Dashboard
  function Dashboard() {
    //Declaring Variables
    const [name, setName] = useState("");
    const [vid, setVid] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    //Navigating
    const navigate = useNavigate();
    
    //To check user logged in and setting the setLoggedIn and setName Variables
    useEffect(() => {
      const storedLoggedIn = localStorage.getItem("loggedIn");
      const storedName = localStorage.getItem("name");
      const storedVid = localStorage.getItem("vid");


      axios.get('http://localhost:8081/dashboard')
      .then(res => {
        setUser(res.data);
      })
      .catch(err => console.log(err));
    
      if (storedLoggedIn === "true" && storedName) {
        setLoggedIn(true);
        setName(storedName);
      } else {
        axios
          .get("http://localhost:8081/")
          .then((res) => {
            if (res.data.valid) {
              setLoggedIn(true);
              setName(res.data.username);
              setVid(res.data.vid);
              localStorage.setItem("loggedIn", "true");
              localStorage.setItem("name", res.data.username);
            } else {
              navigate("/");
            }
          })
          .catch((err) => console.log(err));
      }
    }, []);

  //Logout Function 
  const handleLogout = () => {
    axios
      .get("http://localhost:8081/logout")
      .then((res) => {
        if (res.data.success) {
          setLoggedIn(false);
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("name");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };
  
  //Filtering the Data
  const handleSearch = (event) => {
    const value = event.target.value || "";
    setSearchTerm(value.toLowerCase());
  };
  
  const filteredUser = user.filter((data) => {
    return (
      data.fullname.toLowerCase().includes(searchTerm) ||
      data.vid.toLowerCase().includes(searchTerm) ||
      data.atcposition.toLowerCase().includes(searchTerm) ||
      data.date.toLowerCase().includes(searchTerm) ||
      data.time_start.toLowerCase().includes(searchTerm) ||
      data.time_end.toLowerCase().includes(searchTerm)

    );
  });

  //Deleteing the Booking
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/dashboard/booking_remove/`+id,);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  //HTML Code
  return (
    <>
     {loggedIn ? (
      <>
           <link
                href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"
                rel="stylesheet"
            />
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Welcome {name}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
<input
          type="text"
          id="search-input"
          placeholder="Filter The Bookings"
          className="mt-10"
          value={searchTerm}
          onChange={handleSearch}
        />
      <Link to={{ pathname: "/dashboard/create" , search: `?username=${name}`}} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ml-2">Add Booking</Link>        <table className="table-responsive123 w-full mt-6 text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Full Name
                </th>
                <th scope="col" className="px-6 py-3">
                    VID
                </th>
                <th scope="col" className="px-6 py-3">
                    ATC Position
                </th>
                <th scope="col" className="px-6 py-3">
                    Date
                </th>
                <th scope="col" className="px-6 py-3">
                    Start Time
                </th>
                <th scope="col" className="px-6 py-3">
                    End Time
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
          {
            filteredUser.map((data, i) => (
            <tr  key={i} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {data.fullname}
                </th>
                <td className="px-6 py-4">
                    {data.vid}
                </td>
                <td className="px-6 py-4">
                    {data.atcposition}
                </td>
                <td className="px-6 py-4">
                    {data.date}
                </td>
                <td className="px-6 py-4">
                {data.time_start}
                </td>
                <td className="px-6 py-4">
                {data.time_end}
                </td>
                <td className="px-6 py-4">
                  {name === data.fullname ? (
                    <div>
                  <Link to={{ pathname: `/dashboard/bookings/update/${data.id}` , search: `?username=${name}`}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
                      <button className="font-medium text-blue-600 ml-2 dark:text-blue-500 hover:underline" onClick={(e) => handleDelete(data.id)}>Delete</button>
                    </div>
                  ) : null}
                </td>

            </tr>
))
}
        </tbody>
    </table>
</div>



</>
      ) : (
        <p>Please log in to access the dashboard.</p>
      )}
    </>
  );
}



export default Dashboard;
