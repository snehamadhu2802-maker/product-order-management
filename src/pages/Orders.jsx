import {useCallback, useEffect, useMemo, useState,} from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/apiService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getOrders();
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Status Options
  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(orders.map((order) => order.status)),
    ];
    return ["All", ...uniqueStatuses];
  }, [orders]);

  // Search + Filter + Sort
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    // Search by customer
    if (search.trim()) {
      result = result.filter((order) =>
        order.customer.toLowerCase().includes(search.toLowerCase()));
    }

    // Status filter
    if (status !== "All") {
      result = result.filter((order) => order.status === status);
    }

    // Date sorting
    if (sort === "newest") {
      result.sort((a, b) =>
          new Date(b.date) - new Date(a.date));
    }
    if (sort === "oldest") {
      result.sort((a, b) =>
          new Date(a.date) - new Date(b.date));
    }

    return result;
  }, [orders, search, status, sort]);

  // Total Order Amount
  const totalOrderAmount = useMemo(() => {
    return filteredOrders.reduce(
      (total, order) =>
        total + Number(order.total), 0);
  }, [filteredOrders]);

  // Status Badge
  const getStatusClass = useCallback(
    (orderStatus) => {
      if (orderStatus === "Delivered") {
        return "bg-success";
      }
      if (orderStatus === "Pending") {
        return "bg-warning text-dark";
      }
      if (orderStatus === "Cancelled") {
        return "bg-danger";
      }
      return "bg-primary";
    },[]);

  // Loading
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" >
          <span className="visually-hidden">Loading... </span>
        </div>
        <p className="mt-3 text-muted"> Loading orders...</p>
      </div>
    );
  }

  // UI
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1"> Orders </h2>
        <p className="text-muted mb-0"> View and manage customer orders</p>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold"> Search Orders </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input type="text" className="form-control" placeholder="Search by customer name..." value={search} onChange={(e) =>
                    setSearch(e.target.value)
                  } />
              </div>
            </div>

            {/* Status */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label fw-semibold"> Status </label>
              <select className="form-select" value={status} onChange={(e) =>
                  setStatus(e.target.value)
                } >
                {statuses.map((item) => (
                  <option key={item} value={item} > {item}</option>
                ))}
              </select>
            </div>

            {/* Date Sort */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label fw-semibold"> Sort by Date </label>
              <select className="form-select" value={sort} onChange={(e) =>
                  setSort(e.target.value)
                }>
                <option value="">Default </option>
                <option value="newest">  Newest First </option>
                <option value="oldest">  Oldest First </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1"> Total Orders </p>
                  <h3 className="fw-bold mb-0">  {filteredOrders.length} </h3>
                </div>
                <div className="fs-1 text-primary">
                  <i className="bi bi-cart-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1"> Total Order Amount </p>
                  <h3 className="fw-bold mb-0"> ₹ {totalOrderAmount.toLocaleString("en-IN" )}
                  </h3>
                </div>
                <div className="fs-1 text-success">
                  <i className="bi bi-currency-rupee"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="px-3">ID </th>
                  <th> Customer </th>
                  <th> Date </th>
                  <th> Status</th>
                  <th> Total</th>
                  <th> Items
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <i className="bi bi-inbox fs-1 text-muted"></i>
                      <p className="mt-2 mb-0 text-muted"> No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-semibold px-3"> #{order.id}</td>
                      <td className="fw-semibold"> {order.customer}</td>
                      <td> {order.date} </td>
                      <td>
                        <span className={`badge ${getStatusClass( order.status)}`} >
                          {order.status}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="fw-semibold"> ₹ {Number( order.total).toLocaleString( "en-IN")} </td>
                      {/* Items */}
                      <td>{order.items} </td>
                      {/* View */}
                      <td>
                        <Link to={`/orders/${order.id}`} className="btn btn-sm btn-info text-white" >
                          <i className="bi bi-eye me-1"></i> View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="text-center mt-3">
        <small className="text-muted">Showing{" "}
          <strong>{filteredOrders.length}</strong>{" "}orders </small>
      </div>
    </div>
  );
}

export default Orders;