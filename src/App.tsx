import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom"

import AdminLayout from "./components/layout/AdminLayout"

import UsersPage from "./pages/UsersPage"
import ProductsPage from "./pages/ProductsPage"
import ShopsPage from "./pages/ShopsPage"
import OrdersPage from "./pages/OrdersPage"
import DeliveriesPage from "./pages/ShipmentsPage"

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route element={<AdminLayout />}>

                    <Route
                        path="/users"
                        element={<UsersPage />}
                    />

                    <Route
                        path="/products"
                        element={<ProductsPage />}
                    />

                    <Route
                        path="/shops"
                        element={<ShopsPage />}
                    />

                    <Route
                        path="/orders"
                        element={<OrdersPage />}
                    />

                    <Route
                        path="/shipments"
                        element={<DeliveriesPage />}
                    />

                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/users" />}
                />

            </Routes>

        </BrowserRouter>

    )
}

export default App
