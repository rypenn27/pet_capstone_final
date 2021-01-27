import { Search } from ".";
import React, { useState, useEffect } from "react";
import PetIcon from "./PetIcon.jpg";
import PetIcon2 from "./PetIcon2.jpg";
import PetIcon3 from "./PetIcon3.jpeg";
import { getSomething } from "../api";

const Header = (props) => {
  const pets = props.pets;
  const setPets = props.setPets;

  return (
    <header>
      <h1 className="logo">Pet Rescuers</h1>
      <h5>Find Your Forever Friend!</h5>
      <div className="images">
      <img src={PetIcon} alt="PetIcon" />
      <img src={PetIcon2} alt="PetIcon2" />
      <img src={PetIcon3} alt="PetIcon3" />
      </div>
      <Search pets={pets} setPets={setPets} />
    </header>
  );
};

export default Header;
