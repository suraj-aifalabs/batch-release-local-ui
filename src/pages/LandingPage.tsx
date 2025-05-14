import CustomButton from "@/custom_components/CustomButton"
import CustomContainer from "@/custom_components/CustomContainer"
import { Link } from "react-router-dom"

const LandingPage = () => {
    return (
        <CustomContainer>
            <div className="flex flex-col justify-center h-[90dvh] gap-4 items-center">
                <p className="text-xl">Setting Page</p>
                <Link to="/setting/release"><CustomButton type="primary" text="Go to Configuration" /></Link>
            </div >
        </CustomContainer>
    )
}

export default LandingPage
