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
import LoginPage from "./pages/LoginPage"
import OrderDetailsPage from "./pages/OrderDetailsPage"
import ShipmentsPage from "./pages/ShipmentsPage"
import CreateOrderPage from "./pages/CreateOrderPage"
import CreateShipmentPage from "./pages/CreateShipmentPage"
import ProtectedRoute from "./components/ProtectedRoute"
import WarehouseLayout from "./components/layout/WarehouseLayout"
import ShopkeeperLayout from "./components/layout/ShopkeeperLayout"
import WarehouseStocksPage from "./pages/WarehouseStocksPage"
import ShopStocksPage from "./pages/ShopStocksPage"
import SalesPage from "./pages/SalesPage"
import ShipmentDetailsPage from "./pages/ShipmentDetailsPage"
import ThemeSwitcher from "./components/layout/ThemeSwitcher"
import CreateShipmentForStorePage from "./pages/CreateShipmentForStorePage"

function App() {

    return (

        <BrowserRouter>

            <ThemeSwitcher />

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* ADMIN AREA */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* default redirect in /admin */}

                    <Route
                        index
                        element={<Navigate to="users" replace />}
                    />

                    <Route
                        path="users"
                        element={<UsersPage />}
                    />

                    <Route
                        path="products"
                        element={<ProductsPage />}
                    />

                    <Route
                        path="shops"
                        element={<ShopsPage />}
                    />

                    <Route
                        path="orders"
                        element={<OrdersPage />}
                    />

                    <Route
                        path="orders/:id"
                        element={<OrderDetailsPage />}
                    />

                    <Route
                        path="shipments"
                        element={<ShipmentsPage />}
                    />

                    <Route
                        path="shipments/:id"
                        element={<ShipmentsPage />}
                    />

                    <Route
                        path="sales"
                        element={<SalesPage />}
                    />

                </Route>

                {/* SHOPKEEPER AREA */}

                <Route
                    path="/shopkeeper"
                    element={
                        <ProtectedRoute role="SHOPKEEPER">
                            <ShopkeeperLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* default redirect in /shopkeeper */}

                    <Route
                        index
                        element={<Navigate to="stocks" replace />}
                    />

                    <Route
                        path="stocks"
                        element={<ShopStocksPage />}
                    />

                    <Route
                        path="orders"
                        element={<OrdersPage />}
                    />

                    <Route
                        path="orders/create"
                        element={<CreateOrderPage />}
                    />

                    <Route
                        path="orders/:id"
                        element={<OrderDetailsPage />}
                    />

                    <Route
                        path="shipments"
                        element={<ShipmentsPage />}
                    />

                    <Route
                        path="shipments/:id"
                        element={<ShipmentDetailsPage />}
                    />

                    <Route
                        path="sales"
                        element={<SalesPage />}
                    />

                </Route>

                {/* STOREKEEPER AREA */}

                <Route
                    path="/warehouse"
                    element={
                        <ProtectedRoute role="STOREKEEPER">
                            <WarehouseLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={<Navigate to="stocks" replace />}
                    />

                    <Route
                        path="stocks"
                        element={<WarehouseStocksPage />}
                    />

                    <Route
                        path="orders"
                        element={<OrdersPage />}
                    />

                    <Route
                        path="orders/:id"
                        element={<OrderDetailsPage />}
                    />

                    <Route
                        path="shipments"
                        element={<ShipmentsPage />}
                    />

                    <Route
                        path="shipments/create/:id"
                        element={<CreateShipmentPage />}
                    />

                    <Route
                        path="shipments/create"
                        element={<CreateShipmentForStorePage />}
                    />

                    <Route
                        path="shipments/:id"
                        element={<ShipmentDetailsPage />}
                    />

                </Route>

                {/* ROOT REDIRECT */}

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* fallback */}

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

}
export default App
