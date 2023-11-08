import Image from "next/image"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-screen flex items-center justify-center flex-col'>
            {children}
        </div>
    )
}

export default AuthLayout
