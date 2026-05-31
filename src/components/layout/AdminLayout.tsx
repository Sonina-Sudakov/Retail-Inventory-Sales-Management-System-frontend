import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"

export default function AdminLayout() {

    return (
        <div className="flex">

            <Sidebar />

            <main className="flex-1 p-8 bg-gray-100 min-h-screen">
                <Outlet />
            </main>

        </div>
    )
}
