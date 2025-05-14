// https://ground.bossadizenith.me/docs/button
import { Spinner } from "@/utils/Spinner";
import { ArrowRight } from "lucide-react";
import React, { ReactNode, MouseEvent } from "react";

interface CustomButtonProps {
    text?: string;
    icon?: ReactNode;
    className?: string;
    isLoading?: boolean;
    disabled?: boolean;
    type?: "primary" | "secondary" | "default";
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

const CustomButton: React.FC<CustomButtonProps> = ({
    text,
    icon,
    type = "default",
    className,
    onClick = () => { },
    isLoading,
    disabled,
    ...props
}) => {

    const buttonTypeStyle = {
        primary: "bg-[#EB1700] hover:bg-red-700 w-full text-white rounded-full disabled:bg-gray-700 disabled:cursor-not-allowed",
        secondary: "bg-white border-2 text-black w-full hover:bg-gray-100 disabled:bg-gray-700 rounded-full disabled:cursor-not-allowed",
        default: "bg-[#000000] w-full text-white hover:bg-[#333333] disabled:bg-gray-700 rounded-full disabled:cursor-not-allowed",
    };

    const buttonClass = buttonTypeStyle[type] || buttonTypeStyle.default;

    const defaultIcon = (
        <ArrowRight className="w-5 h-5" />
    );

    return (
        <div className="items-center">
            <button
                disabled={disabled || isLoading}
                className={`py-3 cursor-pointer px-6 max-h-11 justify-center font-normal rounded-3xl flex items-center gap-2 ${buttonClass} ${className}`}
                onClick={(e) => onClick(e)}
                {...props}
            >
                {isLoading ? (
                    <>
                        <span>{text ?? "Learn More"}</span>
                        <Spinner />
                    </>
                ) : (
                    <>
                        <span>{text ?? "Learn More"}</span>
                        {icon ?? defaultIcon}
                    </>
                )}
            </button>
        </div>
    );
};

export default CustomButton;