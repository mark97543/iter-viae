//Header.tsx

import './Header.css'
import { HeaderLeft, HeaderMiddle, HeaderRight } from './Header.html'
import React, { useState, useEffect } from "react";

const Header = () =>{
  const [isScrolled, setIsScrolled]=useState(false)

  useEffect(()=>{
    const handleScroll = () =>{
      //if use scrolls more than 60px trigger the floating state
      setIsScrolled(window.scrollY>60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  },[])

  return(
    <header className={`Header_wrapper ${isScrolled ? 'scrolled':''}`}>
      <HeaderLeft/>
      <HeaderMiddle/>
      <HeaderRight/>
    </header>
  )
}

export default Header