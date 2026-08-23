import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../services/apiService";

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

// Fetch order
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getOrderById(id);
                setOrder(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

// loading
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading order details...</p>
            </div>
        );
    }

//Error
    if (error || !order) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <i className="bi bi-exclamation-circle fs-1 text-danger"></i>
                    <h4 className="mt-3"> {error || "Order not found"}</h4>
                    <p className="text-muted">The requested order could not be found.</p>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/orders")} >
                        <i className="bi bi-arrow-left me-2"></i> Back to Orders
                    </button>
                </div>
            </div>
        );
    }

//Status class
    const getStatusClass = () => {
        if (order.status === "Delivered") {
            return "bg-success";
        }
        if (order.status === "Pending") {
            return "bg-warning text-dark";
        }
        if (order.status === "Cancelled") {
            return "bg-danger";
        }
        return "bg-primary";
    };


    return (
        <div className="container py-4">
            <button type="button" className="btn btn-outline-secondary mb-4" onClick={() => navigate("/orders")} >
                <i className="bi bi-arrow-left me-2"></i>Back to Orders
            </button>

            {/* Heading */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Order Details </h2>
                <p className="text-muted mb-0">View complete information about this order </p>
            </div>

            {/* Order Card */}
            <div className="card border-0 shadow-sm">

                {/* Card Header */}
                <div className="card-header bg-dark text-white py-3">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                        <h4 className="mb-0"> Order #{order.id}</h4>
                        <span className={`badge ${getStatusClass()}`} >{order.status} </span>
                    </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                    <div className="row g-4">
                        {/* Customer */}
                        <div className="col-12 col-md-6">
                            <div className="border rounded p-3 h-100">
                                <div className="d-flex align-items-center">
                                    <div className="fs-3 text-primary me-3">
                                        <i className="bi bi-person-circle"></i>
                                    </div>
                                    <div>
                                        <small className="text-muted">Customer </small>
                                        <h5 className="mb-0 fw-semibold"> {order.customer} </h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="col-12 col-md-6">
                            <div className="border rounded p-3 h-100">
                                <div className="d-flex align-items-center">
                                    <div className="fs-3 text-primary me-3">
                                        <i className="bi bi-calendar-event"></i>
                                    </div>
                                    <div>
                                        <small className="text-muted"> Order Date </small>
                                        <h5 className="mb-0 fw-semibold">{order.date} </h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="col-12 col-md-6">
                            <div className="border rounded p-3 h-100">
                                <div className="d-flex align-items-center">
                                    <div className="fs-3 text-primary me-3">
                                        <i className="bi bi-box-seam"></i>
                                    </div>
                                    <div>
                                        <small className="text-muted"> Number of Items </small>
                                        <h5 className="mb-0 fw-semibold">  {order.items} </h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="col-12 col-md-6">
                            <div className="border rounded p-3 h-100">
                                <div className="d-flex align-items-center">
                                    <div className="fs-3 text-success me-3">
                                        <i className="bi bi-currency-rupee"></i>
                                    </div>
                                    <div>
                                        <small className="text-muted"> Total Amount</small>
                                        <h5 className="mb-0 fw-bold text-success">₹
                                            {Number(order.total).toLocaleString("en-IN")}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="card-footer bg-white">
                    <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
                        <button type="button" className="btn btn-secondary"  onClick={() => navigate("/orders")} >
                            <i className="bi bi-arrow-left me-2"></i>Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;