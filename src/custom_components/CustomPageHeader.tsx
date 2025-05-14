import { Link } from "react-router-dom"
import { RiArrowLeftSLine } from "@remixicon/react"

interface CustomPageHeaderTitleProps {
    title: string;
    link: string;
}

const CustomPageHeaderTitle: React.FC<CustomPageHeaderTitleProps> = ({ title, link }) => {
    return (
        <div className="flex items-center justify-center gap-2">
            <Link to={link}><RiArrowLeftSLine className="w-8 h-8 p-1 text-[#464545] hover:bg-gray-100 rounded-full" /></Link>
            <div className="text-2xl text-[#464545] font-bold" >{title}</div>
        </div>
    );
}

export default CustomPageHeaderTitle
