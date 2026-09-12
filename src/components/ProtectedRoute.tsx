// components/ProtectedRoute.tsx

import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../utils/jwt';

interface Props {
    children: JSX.Element;
    role: string;
}

export default function ProtectedRoute({
    children,
    role
}: Props) {

    const userRole = getRole();

    if (!userRole) {
        return <Navigate to="/login" />;
    }

    if (userRole !== role) {
        return <Navigate to="/login" />;
    }

    return children;
}
