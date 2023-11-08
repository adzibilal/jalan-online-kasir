import Navbar from "./_components/navbar"
import Sidebar from "./_components/sidebar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full'>
            <div className='h-[80px] xl:pl-56 fixed inset-y-0 w-full z-50 bg-zinc-900'>
                <Navbar />
            </div>
            <div className='hidden xl:flex h-full w-56 flex-col fixed inset-y-0 z-50 bg-zinc-950'>
                <Sidebar />
            </div>
            <main className='xl:pl-56 pt-[80px] h-full'>{children}</main>
        </div>
    )
}

export default DashboardLayout
