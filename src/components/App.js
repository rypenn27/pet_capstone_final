import React, { useState, useEffect } from "react";
import { Header, Home } from ".";
import { getSomething } from "../api";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSomething()
      .then((response) => {
        setMessage(response.message);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  });

  return (
    <>
      <Header />
      <Home />
    </>
  );
};

export default App;
