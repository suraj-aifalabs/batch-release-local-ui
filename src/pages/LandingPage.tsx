import CustomButton from "@/custom_components/CustomButton"
import CustomContainer from "@/custom_components/CustomContainer"
import { Link } from "react-router-dom"

const LandingPage = () => {
    return (
        <CustomContainer >
            <div className="flex flex-col justify-center h-[90dvh] gap-4 items-center w-full">
                <Link to="/setting/release"><CustomButton className="w-full" type="primary" text="View PDF" /></Link>
            </div >
        </CustomContainer>
    )
}

export default LandingPage
