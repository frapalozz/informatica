"use client"
import React from 'react'
import Snowfall from 'react-snowfall'

export default function Snow() {
  const month = new Date().getMonth()+1;
  let snow = false;

  if(month > 11 || month < 3) snow = true;
  
  return (
    <>
      {snow && <Snowfall style={{ zIndex: 50 }}/>}
    </>
  )
}
