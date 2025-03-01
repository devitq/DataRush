import { ChevronDown } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-black px-3 py-2 rounded font-hse-sans">
            <span className="font-bold text-yellow-400">DATA</span>
            <span className="font-bold text-white">RUSH</span>
          </div>
        </div>
        
        <div className="flex items-center cursor-pointer">
          <span className="mr-2 font-semibold font-hse-sans">itqdev</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </nav>
  );
};


export default Navbar