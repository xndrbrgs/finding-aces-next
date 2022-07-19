import Link from "next/link";
import { AiOutlineInstagram } from 'react-icons/ai';
import { AiOutlineFacebook } from 'react-icons/ai';
import { AiOutlineTwitter } from 'react-icons/ai';

 function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
        <div className="flex items-center space-x-5">
            <Link href='/'>
                <img className="w-44 object-contain cursor-pointer" src="https://links.papareact.com/yvf" alt="" />
            </Link>
            <div className="hidden md:inline-flex items-center space-x-5">
                <h3>About</h3>
                <h3 className="bg-green-500 text-white px-4 py-1 rounded-full hover:animate-bounce cursor-pointer">Contact</h3>
            </div>
        </div>

        <div className="flex items-center space-x-7 cursor-pointer">
            <Link href='https://www.instagram.com/xanderborges/'>
            <AiOutlineInstagram className="w-6 h-6  hover:text-green-500 transition-all hover:animate-bounce " />
            </Link>
            <AiOutlineFacebook className="w-6 h-6  hover:text-green-500 transition-all hover:animate-bounce "/>
            <AiOutlineTwitter className="w-6 h-6  hover:text-green-500 transition-all hover:animate-bounce "/>
        </div>
    </header>
  )
}

export default Header