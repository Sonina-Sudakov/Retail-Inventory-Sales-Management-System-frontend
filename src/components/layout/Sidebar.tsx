import { Link } from "react-router-dom"

export default function Sidebar() {

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">

            <h1 className="text-2xl font-bold mb-8">
                Admin Panel
            </h1>

            <nav className="flex flex-col gap-2">

                <Link to="/users">
                    Users
                </Link>

                <Link to="/products">
                    Products
                </Link>

                <Link to="/shops">
                    Shops
                </Link>

                <Link to="/orders">
                    Orders
                </Link>

                <Link to="/shipments">
                    Shipments
                </Link>

            </nav>

        </aside>
    )
}
