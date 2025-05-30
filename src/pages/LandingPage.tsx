import CustomButton from "@/custom_components/CustomButton"
import CustomContainer from "@/custom_components/CustomContainer"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { useState } from "react"
const LandingPage = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    return (
        <CustomContainer >
            <div className="flex flex-col justify-center h-[90dvh] gap-4 items-center w-full">
                <Input type="username" placeholder="Username" className="w-[300px]" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input type="email" placeholder="Email" className="w-[300px]" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Link state={{ username, email }} to="/setting/release"><CustomButton type="primary" text="Login" /></Link>
            </div >
        </CustomContainer>
    )
}

export default LandingPage
