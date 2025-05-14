import React, { ReactNode } from 'react';

interface CustomContainerProps {
    children: ReactNode;
}

const CustomContainer: React.FC<CustomContainerProps> = ({ children }) => {
    return (
        <div className='px-4'>{children}</div>
    );
};

export default CustomContainer;