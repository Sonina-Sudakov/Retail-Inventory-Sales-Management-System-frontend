import { useEffect, useState } from "react"

import CreateUserModal from "../components/user/CreateUserModal"
import ChangeFullnameModal from "../components/user/ChangeFullnameModal"
import ChangePasswordModal from "../components/user/ChangePasswordModal"
import { api } from "../api/api"
import type { User } from "../types/user"

import {
    Table,
    Input,
    Select,
    Button,
    Card,
    Space,
    Typography,
    Popconfirm
} from "antd"


export default function UsersPage() {

    const [users, setUsers] = useState<User[]>([])

    const [search, setSearch] = useState("")

    const [createOpen, setCreateOpen] = useState(false)
    const [fullnameOpen, setFullnameOpen] = useState(false)
    const [passwordOpen, setPasswordOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    async function loadUsers() {

        const response = await api.get("/users/all")

        setUsers(response.data.items)
    }

    useEffect(() => {
        loadUsers()
    }, [])


    async function deleteUser(id: number) {

        await api.delete(`/users?id=${id}`)

        await loadUsers()
    }


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username"
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname"
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",

            filters: [
                {
                    text: "Admin",
                    value: "ADMIN"
                },
                {
                    text: "Storekeeper",
                    value: "STOREKEEPER"
                },
                {
                    text: "Shopkeeper",
                    value: "SHOPKEEPER"
                }
            ],

            onFilter: (value, user) =>
                user.role === value
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, user: User) => (
               <>
                <Button
                    onClick={() => {
                        setSelectedUser(user)
                        setFullnameOpen(true)
                    }}
                    style={{ marginRight: 8 }}
                >
                    Change fullname
                </Button>

                <Button
                    onClick={() => {
                        setSelectedUser(user)
                        setPasswordOpen(true)
                    }}
                    style={{ marginRight: 8 }}
                >
                    Change password
                </Button>


                <Popconfirm
                    title="Delete user?"
                    onConfirm={() => deleteUser(user.id)}
                >
                    <Button danger>
                        Delete
                    </Button>
                </Popconfirm>
              </>            
            )
        }
    ]

    const filteredUsers = users.filter(user => {

        const foundInUsername =
            user.username
                .toLowerCase()
                .includes(search.toLowerCase())

        const foundInFullname =
            user.fullname
                .toLowerCase()
                .includes(search.toLowerCase())
        
        return foundInUsername || foundInFullname
    })


   return (
        <div className="p-8">

            <Typography.Title
                level={1}
                style={{
                    textAlign: "left",
                    marginBottom: 16
                }}
            >
                Users
            </Typography.Title>

            <Card>

               <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16
                    }}
                >
                    <Input
                        placeholder="Search users"
                        value={search}
                        style={{ width: 500 }}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button
                        type="primary"
                        onClick={() => {
                            setCreateOpen(true)
                        }}
                    >
                        Create User
                    </Button>
                </div> 
                
                <Table
                    rowKey="id"
                    dataSource={filteredUsers}
                    columns={columns}
                    pagination={{
                        pageSize: 10
                    }}
                />

            </Card>

             <CreateUserModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={loadUsers}
            />

            <ChangeFullnameModal
                user={selectedUser}
                open={fullnameOpen}
                onClose={() => setFullnameOpen(false)}
                onSuccess={loadUsers}
            />

            <ChangePasswordModal
                user={selectedUser}
                open={passwordOpen}
                onClose={() => setPasswordOpen(false)}
                onSuccess={loadUsers}
            />

        </div>

    ) 

}
