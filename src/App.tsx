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
import LoginPage from "./pages/LoginPage"
import OrderDetailsPage from "./pages/OrderDetailsPage"
import ShipmentsPage from "./pages/ShipmentsPage"
import CreateOrderPage from "./pages/CreateOrderPage"
import CreateShipmentPage from "./pages/CreateShipmentPage"

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
                        path="/orders/:id"
                        element={<OrderDetailsPage />}
                    />

                    <Route
                        path="/orders/create"
                        element={<CreateOrderPage />}
                    />

                    <Route
                        path="/shipments"
                        element={<ShipmentsPage />}
                    />

                    <Route
                        path="/shipments/create/:orderId"
                        element={<CreateShipmentPage />}
                    />


                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/users" />}
                />


                <Route path="/login" element={<LoginPage />} />


            </Routes>

        </BrowserRouter>

    )
}

export default App
