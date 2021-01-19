import { Search } from ".";
import React, { useState, useEffect } from "react";

import { getSomething } from "../api";

const Header = () => {
  return (
    <>
      <Search />
    </>
  );
};

export default Header;
