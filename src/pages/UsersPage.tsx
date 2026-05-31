import { useEffect, useState } from "react"
import { api } from "../api/api"
import type { User } from "../types/user"


export default function UsersPage() {

    const [users, setUsers] = useState<User[]>([])

    const [username, setUsername] = useState("")
    const [fullname, setFullname] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")

    async function loadUsers() {

        const response = await api.get("/users/")

        setUsers(response.data.items)
    }

    useEffect(() => {
        loadUsers()
    }, [])

    async function createUser() {

        await api.post("/users/", {
            username,
            fullname,
            password,
            role
        })

        setUsername("")
        setFullname("")
        setPassword("")

        await loadUsers()
    }


    async function deleteUser(id: number) {

        await api.delete(`/users/${id}`)

        await loadUsers()
    }


    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-4xl font-bold mb-8">
                    Users
                </h1>

                {/* CREATE USER CARD */}

                <div className="bg-white rounded-2xl shadow p-6 mb-8">

                    <h2 className="text-2xl font-semibold mb-4">
                        Create User
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="border rounded-xl p-3"
                        />

                        <input
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Fullname"
                            className="border rounded-xl p-3"
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="border rounded-xl p-3"
                        />

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="" disabled>
                                Role
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>

                            <option value="STOREKEEPER">
                                Storekeeper
                            </option>

                            <option value="SHOPKEEPER">
                                Shopkeeper
                            </option>
                        </select>
                    </div>

                    <button
                        onClick={createUser}
                        className="
                            mt-4
                            bg-black
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            hover:opacity-80
                        "
                    >
                        Create User
                    </button>

                </div>

                {/* USERS TABLE */}

                <div className="bg-white rounded-2xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left p-4">
                                    ID
                                </th>

                                <th className="text-left p-4">
                                    Username
                                </th>

                                <th className="text-left p-4">
                                    Fullname
                                </th>

                                <th className="text-left p-4">
                                    Role
                                </th>

                                <th className="text-left p-4">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {users.map(user => (

                                <tr
                                    key={user.id}
                                    className="border-t"
                                >

                                    <td className="p-4">
                                        {user.id}
                                    </td>

                                    <td className="p-4">
                                        {user.username}
                                    </td>

                                    <td className="p-4">
                                        {user.fullname}
                                    </td>

                                    <td className="p-4">
                                        {user.role}
                                    </td>

                                    <td className="p-4">

                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="
                                                bg-red-500
                                                text-white
                                                px-4
                                                py-2
                                                rounded-xl
                                                hover:opacity-80
                                            "
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}
