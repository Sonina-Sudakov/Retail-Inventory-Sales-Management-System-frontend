import { useParams } from "react-router-dom"

export default function OrderDetailsPage() {
    const { id } = useParams()

    return <div>Order {id}</div>
}
