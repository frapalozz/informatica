"use client"
import React, { useState } from 'react'
import { VT323 } from "next/font/google";

const vt323 = VT323({ subsets: ['latin'], weight: '400'});

setTimeout(() => {
    const bottone = document.getElementById('btn-container');

    if(bottone) {
        bottone.style.bottom = "16px"
    }
}, 3000);

export default function DonationButton() {

    function getElement(id: number) {

        let text = "";

        switch (click) {
            case 9:
                text = "10 monetine 😑"
                break;
            case 49:
                text = "50 monetine 😐"
                break;
            case 99:
                text = "100 monete 👀"
                break;
            case 199:
                text = "200 monete 🤨"
                break;
            case 499:
                text = "500 monete 🤑"
                break;
            case 999:
                text = "1000 monete 😤"
                break;
            case 1999:
                text = "2000 monete 🏦"
                break;
            case 4999:
                text = "5000 monete 🤖"
                break;
            case 9999:
                text = "10000 monete 🕴️"
                break;
            default:
                text = "+1 monetina"
                break;
        }

        const element = (
            <div className='text-yellow-600 text-sm relative z-[100]'>
                <div id={id.toString()} className='flex items-center text-center w-full justify-center absolute bottom-0 right-auto left-auto transition-all duration-[1s] ease-in-out'>
                    <svg width="25" height="25" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6H13V7H19V6Z" fill="#FFC110"/>
                    <path d="M14 7H11V8H14V7Z" fill="#FFC110"/>
                    <path d="M18 7H14V8H18V7Z" fill="#DB8323"/>
                    <path d="M21 7H18V8H21V7Z" fill="#FFC110"/>
                    <path d="M12 8H9V9H12V8Z" fill="#FFC110"/>
                    <path d="M14 8H12V9H14V8Z" fill="#DB8323"/>
                    <path d="M18 8H14V9H18V8Z" fill="#FFC110"/>
                    <path d="M20 8H18V9H20V8Z" fill="#DB8323"/>
                    <path d="M23 8H20V9H23V8Z" fill="#FFC110"/>
                    <path d="M10 9H8V10H10V9Z" fill="#FFC110"/>
                    <path d="M12 9H10V10H12V9Z" fill="#DB8323"/>
                    <path d="M20 9H12V10H20V9Z" fill="#FFC110"/>
                    <path d="M22 9H20V10H22V9Z" fill="#DB8323"/>
                    <path d="M24 9H22V10H24V9Z" fill="#FFC110"/>
                    <path d="M9 10H8V11H9V10Z" fill="#FFC110"/>
                    <path d="M10 10H9V11H10V10Z" fill="#DB8323"/>
                    <path d="M22 10H10V11H22V10Z" fill="#FFC110"/>
                    <path d="M23 10H22V11H23V10Z" fill="#DB8323"/>
                    <path d="M24 10H23V11H24V10Z" fill="#FFC110"/>
                    <path d="M9 11H7V12H9V11Z" fill="#FFC110"/>
                    <path d="M10 11H9V12H10V11Z" fill="#DB8323"/>
                    <path d="M22 11H10V12H22V11Z" fill="#FFC110"/>
                    <path d="M23 11H22V12H23V11Z" fill="#DB8323"/>
                    <path d="M25 11H23V12H25V11Z" fill="#FFC110"/>
                    <path d="M8 12H7V13H8V12Z" fill="#FFC110"/>
                    <path d="M9 12H8V13H9V12Z" fill="#DB8323"/>
                    <path d="M18 12H9V13H18V12Z" fill="#FFC110"/>
                    <path d="M21 12H18V13H21V12Z" fill="#FFF671"/>
                    <path d="M23 12H21V13H23V12Z" fill="#FFC110"/>
                    <path d="M24 12H23V13H24V12Z" fill="#DB8323"/>
                    <path d="M25 12H24V13H25V12Z" fill="#FFC110"/>
                    <path d="M8 13H6V14H8V13Z" fill="#FFC110"/>
                    <path d="M9 13H8V14H9V13Z" fill="#DB8323"/>
                    <path d="M12 13H9V14H12V13Z" fill="#FFC110"/>
                    <path d="M15 13H12V14H15V13Z" fill="#FFF671"/>
                    <path d="M23 13H15V14H23V13Z" fill="#FFC110"/>
                    <path d="M24 13H23V14H24V13Z" fill="#DB8323"/>
                    <path d="M26 13H24V14H26V13Z" fill="#FFC110"/>
                    <path d="M7 14H6V15H7V14Z" fill="#FFC110"/>
                    <path d="M8 14H7V15H8V14Z" fill="#DB8323"/>
                    <path d="M24 14H8V15H24V14Z" fill="#FFC110"/>
                    <path d="M25 14H24V15H25V14Z" fill="#DB8323"/>
                    <path d="M26 14H25V15H26V14Z" fill="#FFC110"/>
                    <path d="M7 15H6V16H7V15Z" fill="#FFC110"/>
                    <path d="M8 15H7V16H8V15Z" fill="#DB8323"/>
                    <path d="M24 15H8V16H24V15Z" fill="#FFC110"/>
                    <path d="M25 15H24V16H25V15Z" fill="#DB8323"/>
                    <path d="M26 15H25V16H26V15Z" fill="#FFC110"/>
                    <path d="M7 16H6V17H7V16Z" fill="#FFC110"/>
                    <path d="M8 16H7V17H8V16Z" fill="#DB8323"/>
                    <path d="M24 16H8V17H24V16Z" fill="#FFC110"/>
                    <path d="M25 16H24V17H25V16Z" fill="#DB8323"/>
                    <path d="M26 16H25V17H26V16Z" fill="#FFC110"/>
                    <path d="M7 17H6V18H7V17Z" fill="#FFC110"/>
                    <path d="M8 17H7V18H8V17Z" fill="#DB8323"/>
                    <path d="M24 17H8V18H24V17Z" fill="#FFC110"/>
                    <path d="M25 17H24V18H25V17Z" fill="#DB8323"/>
                    <path d="M26 17H25V18H26V17Z" fill="#FFC110"/>
                    <path d="M8 18H6V19H8V18Z" fill="#FFC110"/>
                    <path d="M9 18H8V19H9V18Z" fill="#DB8323"/>
                    <path d="M26 18H9V19H26V18Z" fill="#FFC110"/>
                    <path d="M8 19H7V20H8V19Z" fill="#FFC110"/>
                    <path d="M9 19H8V20H9V19Z" fill="#DB8323"/>
                    <path d="M25 19H9V20H25V19Z" fill="#FFC110"/>
                    <path d="M9 20H7V21H9V20Z" fill="#FFC110"/>
                    <path d="M10 20H9V21H10V20Z" fill="#DB8323"/>
                    <path d="M25 20H10V21H25V20Z" fill="#FFC110"/>
                    <path d="M9 21H8V22H9V21Z" fill="#FFC110"/>
                    <path d="M10 21H9V22H10V21Z" fill="#DB8323"/>
                    <path d="M12 21H10V22H12V21Z" fill="#FFC110"/>
                    <path d="M13 21H12V22H13V21Z" fill="#FFF671"/>
                    <path d="M14 21H13V22H14V21Z" fill="#FFC110"/>
                    <path d="M18 21H14V22H18V21Z" fill="#FFF671"/>
                    <path d="M22 21H18V22H22V21Z" fill="#FFC110"/>
                    <path d="M23 21H22V22H23V21Z" fill="#DB8323"/>
                    <path d="M24 21H23V22H24V21Z" fill="#FFC110"/>
                    <path d="M10 22H8V23H10V22Z" fill="#FFC110"/>
                    <path d="M12 22H10V23H12V22Z" fill="#DB8323"/>
                    <path d="M20 22H12V23H20V22Z" fill="#FFC110"/>
                    <path d="M22 22H20V23H22V22Z" fill="#DB8323"/>
                    <path d="M24 22H22V23H24V22Z" fill="#FFC110"/>
                    <path d="M12 23H9V24H12V23Z" fill="#FFC110"/>
                    <path d="M14 23H12V24H14V23Z" fill="#DB8323"/>
                    <path d="M18 23H14V24H18V23Z" fill="#FFC110"/>
                    <path d="M20 23H18V24H20V23Z" fill="#DB8323"/>
                    <path d="M23 23H20V24H23V23Z" fill="#FFC110"/>
                    <path d="M14 24H11V25H14V24Z" fill="#FFC110"/>
                    <path d="M18 24H14V25H18V24Z" fill="#DB8323"/>
                    <path d="M21 24H18V25H21V24Z" fill="#FFC110"/>
                    <path d="M19 25H13V26H19V25Z" fill="#FFC110"/>
                    </svg>
                    {text}
                </div>
            </div>
        )

        return element;
    }

    const [click, setClick] = useState(0);
    const [popupOpen, setPopupOpen] = useState(true);
    const [monete, setMonete] = useState<React.JSX.Element[]>([])

    function handleClick() {
        setClick(click+1);

        setMonete([...monete, getElement(click)])

        setTimeout(
            () => {
                const testo = document.getElementById(click.toString());
                if(testo) {
                    testo.style.bottom = '25px';
                    testo.style.opacity = '0'
                }
            }
        , 500);
    }

    return (
        <>
            <div id='btn-container' className={`${vt323.className} fixed z-[100] -bottom-16 right-auto left-auto flex flex-col-reverse transition-all duration-500 ease-in-out`}>
                
                <div id='btn' onClick={handleClick} className='flex flex-col items-center justify-center dark:text-white text-black select-none dark:bg-zinc-700/5 bg-zinc-200/50 border-2 dark:border-zinc-700 border-zinc-400 hover:border-zinc-300 backdrop-blur px-5 py-3 rounded-md cursor-pointer transition-all duration-300'>
                    <p className='leading-none'>Prendi una Moneta</p>
                        {click > 0 &&
                            <div className='flex items-center justify-center'>
                                <svg width="15" height="15" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 6H13V7H19V6Z" fill="#FFC110"/>
                                <path d="M14 7H11V8H14V7Z" fill="#FFC110"/>
                                <path d="M18 7H14V8H18V7Z" fill="#DB8323"/>
                                <path d="M21 7H18V8H21V7Z" fill="#FFC110"/>
                                <path d="M12 8H9V9H12V8Z" fill="#FFC110"/>
                                <path d="M14 8H12V9H14V8Z" fill="#DB8323"/>
                                <path d="M18 8H14V9H18V8Z" fill="#FFC110"/>
                                <path d="M20 8H18V9H20V8Z" fill="#DB8323"/>
                                <path d="M23 8H20V9H23V8Z" fill="#FFC110"/>
                                <path d="M10 9H8V10H10V9Z" fill="#FFC110"/>
                                <path d="M12 9H10V10H12V9Z" fill="#DB8323"/>
                                <path d="M20 9H12V10H20V9Z" fill="#FFC110"/>
                                <path d="M22 9H20V10H22V9Z" fill="#DB8323"/>
                                <path d="M24 9H22V10H24V9Z" fill="#FFC110"/>
                                <path d="M9 10H8V11H9V10Z" fill="#FFC110"/>
                                <path d="M10 10H9V11H10V10Z" fill="#DB8323"/>
                                <path d="M22 10H10V11H22V10Z" fill="#FFC110"/>
                                <path d="M23 10H22V11H23V10Z" fill="#DB8323"/>
                                <path d="M24 10H23V11H24V10Z" fill="#FFC110"/>
                                <path d="M9 11H7V12H9V11Z" fill="#FFC110"/>
                                <path d="M10 11H9V12H10V11Z" fill="#DB8323"/>
                                <path d="M22 11H10V12H22V11Z" fill="#FFC110"/>
                                <path d="M23 11H22V12H23V11Z" fill="#DB8323"/>
                                <path d="M25 11H23V12H25V11Z" fill="#FFC110"/>
                                <path d="M8 12H7V13H8V12Z" fill="#FFC110"/>
                                <path d="M9 12H8V13H9V12Z" fill="#DB8323"/>
                                <path d="M18 12H9V13H18V12Z" fill="#FFC110"/>
                                <path d="M21 12H18V13H21V12Z" fill="#FFF671"/>
                                <path d="M23 12H21V13H23V12Z" fill="#FFC110"/>
                                <path d="M24 12H23V13H24V12Z" fill="#DB8323"/>
                                <path d="M25 12H24V13H25V12Z" fill="#FFC110"/>
                                <path d="M8 13H6V14H8V13Z" fill="#FFC110"/>
                                <path d="M9 13H8V14H9V13Z" fill="#DB8323"/>
                                <path d="M12 13H9V14H12V13Z" fill="#FFC110"/>
                                <path d="M15 13H12V14H15V13Z" fill="#FFF671"/>
                                <path d="M23 13H15V14H23V13Z" fill="#FFC110"/>
                                <path d="M24 13H23V14H24V13Z" fill="#DB8323"/>
                                <path d="M26 13H24V14H26V13Z" fill="#FFC110"/>
                                <path d="M7 14H6V15H7V14Z" fill="#FFC110"/>
                                <path d="M8 14H7V15H8V14Z" fill="#DB8323"/>
                                <path d="M24 14H8V15H24V14Z" fill="#FFC110"/>
                                <path d="M25 14H24V15H25V14Z" fill="#DB8323"/>
                                <path d="M26 14H25V15H26V14Z" fill="#FFC110"/>
                                <path d="M7 15H6V16H7V15Z" fill="#FFC110"/>
                                <path d="M8 15H7V16H8V15Z" fill="#DB8323"/>
                                <path d="M24 15H8V16H24V15Z" fill="#FFC110"/>
                                <path d="M25 15H24V16H25V15Z" fill="#DB8323"/>
                                <path d="M26 15H25V16H26V15Z" fill="#FFC110"/>
                                <path d="M7 16H6V17H7V16Z" fill="#FFC110"/>
                                <path d="M8 16H7V17H8V16Z" fill="#DB8323"/>
                                <path d="M24 16H8V17H24V16Z" fill="#FFC110"/>
                                <path d="M25 16H24V17H25V16Z" fill="#DB8323"/>
                                <path d="M26 16H25V17H26V16Z" fill="#FFC110"/>
                                <path d="M7 17H6V18H7V17Z" fill="#FFC110"/>
                                <path d="M8 17H7V18H8V17Z" fill="#DB8323"/>
                                <path d="M24 17H8V18H24V17Z" fill="#FFC110"/>
                                <path d="M25 17H24V18H25V17Z" fill="#DB8323"/>
                                <path d="M26 17H25V18H26V17Z" fill="#FFC110"/>
                                <path d="M8 18H6V19H8V18Z" fill="#FFC110"/>
                                <path d="M9 18H8V19H9V18Z" fill="#DB8323"/>
                                <path d="M26 18H9V19H26V18Z" fill="#FFC110"/>
                                <path d="M8 19H7V20H8V19Z" fill="#FFC110"/>
                                <path d="M9 19H8V20H9V19Z" fill="#DB8323"/>
                                <path d="M25 19H9V20H25V19Z" fill="#FFC110"/>
                                <path d="M9 20H7V21H9V20Z" fill="#FFC110"/>
                                <path d="M10 20H9V21H10V20Z" fill="#DB8323"/>
                                <path d="M25 20H10V21H25V20Z" fill="#FFC110"/>
                                <path d="M9 21H8V22H9V21Z" fill="#FFC110"/>
                                <path d="M10 21H9V22H10V21Z" fill="#DB8323"/>
                                <path d="M12 21H10V22H12V21Z" fill="#FFC110"/>
                                <path d="M13 21H12V22H13V21Z" fill="#FFF671"/>
                                <path d="M14 21H13V22H14V21Z" fill="#FFC110"/>
                                <path d="M18 21H14V22H18V21Z" fill="#FFF671"/>
                                <path d="M22 21H18V22H22V21Z" fill="#FFC110"/>
                                <path d="M23 21H22V22H23V21Z" fill="#DB8323"/>
                                <path d="M24 21H23V22H24V21Z" fill="#FFC110"/>
                                <path d="M10 22H8V23H10V22Z" fill="#FFC110"/>
                                <path d="M12 22H10V23H12V22Z" fill="#DB8323"/>
                                <path d="M20 22H12V23H20V22Z" fill="#FFC110"/>
                                <path d="M22 22H20V23H22V22Z" fill="#DB8323"/>
                                <path d="M24 22H22V23H24V22Z" fill="#FFC110"/>
                                <path d="M12 23H9V24H12V23Z" fill="#FFC110"/>
                                <path d="M14 23H12V24H14V23Z" fill="#DB8323"/>
                                <path d="M18 23H14V24H18V23Z" fill="#FFC110"/>
                                <path d="M20 23H18V24H20V23Z" fill="#DB8323"/>
                                <path d="M23 23H20V24H23V23Z" fill="#FFC110"/>
                                <path d="M14 24H11V25H14V24Z" fill="#FFC110"/>
                                <path d="M18 24H14V25H18V24Z" fill="#DB8323"/>
                                <path d="M21 24H18V25H21V24Z" fill="#FFC110"/>
                                <path d="M19 25H13V26H19V25Z" fill="#FFC110"/>
                                </svg>
                                <p className='text-xs leading-none'>x{click}</p>
                            </div>
                        }
                </div>

                {monete.map((item) => (item))}
            </div>
            {(click==10 && popupOpen) && 
                <div className={`${vt323.className} fixed w-screen h-screen bg-gray-400/30 z-[100] flex flex-col items-center justify-center`}>
                    <div className='bg-white rounded px-5 py-3 max-w-[300px] flex flex-col items-center justify-center gap-3'>
                        <div onClick={() => setPopupOpen(false)} className='px-3 bg-red-600/20 text-red-600 rounded cursor-pointer'>chiudi</div>
                        <p className='text-center'>Dato che ora hai tante monetine, che ne dici di una donazione? 🥺</p>
                        <a target='_blank' href='https://www.paypal.com/paypalme/FrancescoPalozzi?country.x=IT&locale.x=it_IT' className='bg-black text-white px-3 py-1 rounded'>
                            Donazione
                        </a>
                    </div>
                </div>
            }
        </>
    )
}
