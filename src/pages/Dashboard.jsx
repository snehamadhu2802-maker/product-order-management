import { useEffect, useState } from "react";
import { getProducts, getOrders } from "../services/apiService";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([getProducts(),getOrders(),]);
        setProducts(productsResponse.data);
        setOrders(ordersResponse.data);
      } catch (error) {
        console.log("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Total Revenue
  const totalRevenue = orders.reduce((total, order) => total + Number(order.total || 0),0);
  // Out of Stock
  const outOfStock = products.filter((product) => Number(product.stock) === 0).length;
  // Top 5 products based on rating
  const topProducts = [...products].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 5);
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3 text-muted"> Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">Dashboard</h1>
        <p className="text-muted mb-0">Overview of your product and order management</p>
      </div>

      {/* Dashboard Cards */}
      <div className="row g-4 mb-5">

        {/* Total Products */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-primary text-white h-100">
            <div className="card-body p-4">
              <h6 className="mb-2">Total Products</h6>
              <h2 className="fw-bold mb-0">{products.length}</h2>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-success text-white h-100">
            <div className="card-body p-4">
              <h6 className="mb-2">Total Orders</h6>
              <h2 className="fw-bold mb-0">{orders.length}</h2>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-warning text-dark h-100">
            <div className="card-body p-4">
              <h6 className="mb-2">Total Revenue              </h6>
              <h2 className="fw-bold mb-0">₹{totalRevenue}</h2>
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-danger text-white h-100">
            <div className="card-body p-4">
              <h6 className="mb-2"> Out of Stock</h6>
              <h2 className="fw-bold mb-0">{outOfStock}</h2>
            </div>
          </div>
        </div>
      </div>
      {/* Top Products */}
      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0"> Top 5 Products</h3>
        </div>

        {/* Chart */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row align-items-end g-3">{topProducts.map((product) => (
                <div className="col" key={product.id}>
                  <div className="text-center">
                    <div className="bg-primary rounded-top mx-auto d-flex align-items-end justify-content-center"
                      style={{height: `${Math.max( Number(product.rating || 0) * 45,80)}px`,maxWidth: "100px",}}>
                      <span className="text-white fw-bold pb-2"> {product.rating} </span>
                    </div>
                    <div className="small fw-semibold mt-2 text-truncate">{product.name}</div>
                  </div>
                </div>
              ))}

            </div>

            {topProducts.length === 0 && (
              <div className="text-center text-muted py-5">No products available</div>
            )}
          </div>
        </div>

        {/* Top Products Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 fw-semibold">{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td><span className="badge bg-light text-dark border">
                         <i className="bi bi-star-fill text-warning me-1"></i>
                        {product.rating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;