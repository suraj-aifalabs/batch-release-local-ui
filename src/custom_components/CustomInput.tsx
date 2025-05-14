import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Info, Search } from "lucide-react";
import { CustomLabel } from "./CustomLabel";
import { UseFormRegister, FieldValues, FieldError } from "react-hook-form";

interface CustomInputProps {
    id?: string;
    labelName?: string;
    customMessage?: string;
    inputType?: "text" | "password" | "search" | "email" | "number" | string;
    placeholder?: string;
    inputValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isRequired?: boolean;
    errors?: Record<string, FieldError>;
    showLabel?: boolean;
    className?: string;
    infoMessage?: string;
    showInfo?: boolean;
    register?: UseFormRegister<FieldValues>;
}

export function CustomInput({
    id = "",
    labelName = "Label Name",
    inputType = "text",
    placeholder = "",
    inputValue,
    onChange,
    errors,
    register,
    customMessage = "",
    showInfo = false,
    infoMessage = "",
    className = "",
    showLabel = true,
    ...props
}: CustomInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = inputType === "password";
    const isSearchField = inputType === "search";

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputProps = register
        ? {
            ...register(id, {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (onChange) {
                        onChange(e);
                    }
                },
            }),
        }
        : { onChange };

    return (
        <div>
            {showLabel && <CustomLabel className="px-2 mb-2" labelName={labelName} />}
            <div className="relative">
                <Input
                    id={id}
                    type={isPasswordField ? (showPassword ? "text" : "password") : inputType}
                    placeholder={placeholder}
                    value={inputValue}
                    className={`${className} h-11 my-1 rounded-md bg-transparent focus-visible:ring-1 disabled:cursor-not-allowed focus-visible:ring-blue-700 w-full pr-12`}
                    {...inputProps}
                    {...props}
                />
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 p-1.5 rounded-full transition-colors focus:outline-none"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                )}
                {isSearchField && (
                    <div className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-gray-700 p-1.5 rounded-full transition-colors focus:outline-none">
                        <Search className="h-5 w-5" />
                    </div>
                )}
                {showInfo && (
                    <div className="relative group">
                        <div className="absolute cursor-pointer right-2 bottom-[-2px] -translate-y-1/2 text-gray-700 p-1.5 rounded-full transition-colors focus:outline-none">
                            <Info className="h-4 w-4" />
                        </div>
                        {infoMessage && <div className="absolute hidden group-hover:block right-2 top-[-60px] -translate-y-1/2 bg-white border border-gray-200 shadow-md text-sm px-2 py-1 rounded-md whitespace-nowrap">
                            {infoMessage}
                        </div>}
                    </div>
                )}
            </div>
            {errors && errors[id] && (
                <p className="text-sm whitespace-pre-line text-red-600 px-2 mt-1">{errors[id]?.message}</p>
            )}
            {customMessage && (!errors || !errors[id]) && (
                <p className="text-sm text-green-600 px-2 mt-1">{customMessage}</p>
            )}
        </div>
    );
}