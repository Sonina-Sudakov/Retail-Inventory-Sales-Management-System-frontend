import { Button, Card, Form, Input, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../utils/jwt';
import { theme } from "antd";

const { Title } = Typography;

interface LoginForm {
    username: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { token } = theme.useToken();

    const onFinish = async (values: LoginForm) => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/v1/login',
                values
            );

            localStorage.setItem(
                'access_token',
                response.data.access_token
            );

            message.success('Successfully logged in');

            const role = getRole();

            if (role === 'ADMIN') {
                navigate('/admin');
            }

            if (role === 'SHOPKEEPER') {
                navigate('/shopkeeper');
            }

            if (role === 'STOREKEEPER') {
                navigate('/warehouse');
            }
        } catch {
            message.error('Invalid login or password');
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: token.colorBgContainer,
            }}
        >
            <Card
                style={{
                    width: 400,
                }}
            >
                <Title
                    level={2}
                    style={{
                        textAlign: 'center',
                        marginBottom: 32,
                    }}
                >
                    Sign In
                </Title>

                <Form<LoginForm>
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Login"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter login',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Login"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter password',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
