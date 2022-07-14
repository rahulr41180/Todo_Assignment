
import './App.css';

import { useState, useEffect } from "react";

import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [task, setTask] = useState("");

  const handleSubmit = async (event) => {

    event.preventDefault();

    const data = await axios.post("http://localhost:8080/loginUser",{
      email,
      password
    })
    .then((res) => {
      document.cookie = "loginToken="+res.data.loginToken[0]
      console.log(res, document.cookie)
    })
    .catch((error) => console.log(error))

  }

  const todoSubmit = async (event) => {

    event.preventDefault();

    const data = await axios.post("http://localhost:8080/postTodo",{
      task,
      date : new Date(),
      token : document.cookie
    })
    .then((res) => {
      console.log(res)
    })
    .catch((error) => console.log(error))

  }

  const handleCheck = async () => {
    try {
      // console.log(document.cookie);
      // document.cookie = "loginToken=";
      const data = await axios.post("http://localhost:8080/getLoginUser", {
        token : document.cookie
      })

      .then((res) => console.log(res))
      .catch((error) => console.log(error))
    }
    catch(error) {

    }
  }

  const handleTodo = async () => {
    try {
      // console.log(document.cookie);
      // document.cookie = "loginToken=";
      const data = await axios.post("http://localhost:8080/postTodo", {
        token : document.cookie
      })

      .then((res) => console.log(res))
      .catch((error) => console.log(error))
    }
    catch(error) {

    }
  }

  return (
    <div className="App">
        <form action="" onSubmit={handleSubmit}>
          <input type="text" onChange={(event) => {

            setEmail(event.target.value)
          }} name="" id="" />
          <input type="text" onChange={(event) => {
            setPassword(event.target.value)
          }} name="" id="" />
          <button type="submit">Submit</button>
        </form>

        <form action="" onSubmit={todoSubmit}>
          <input type="text" onChange={(event) => {
            setTask(event.target.value)
          }} name="" id="" />
          <button type="submit">Submit Todo</button>
        </form>
        <button onClick={handleCheck}>Check</button>
        <button onClick={handleTodo}>Todo</button>
    </div>
  );
}

export default App;
