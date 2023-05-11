import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './login';
import Dashboard from './dashboard';
import Signup from "./signup";
import Create from "./create";
import Update from "./update";

//Routing the Functions so it can either post, delete, put, get data
function App(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route exact path="/dashboard/create" element={<Create username={props.name} vid={props.vid} />} />
        <Route exact path="/dashboard/bookings/update/:id" element={<Update username={props.name}/>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
