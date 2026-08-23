import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/apiService";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3"> Loading product... </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Product not found</div>
      </div>
    );
  }
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold"> Product Details</h1>
          <p className="text-muted mb-0"> View product information </p>
        </div>
        <Link to="/products">
          <button className="btn btn-secondary"> ← Back</button>
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0">
            <div className="row g-0">

              {/* Image */}
              <div className="col-md-5 d-flex align-items-center justify-content-center p-4">
                <img src={product.image} alt={product.name} className="img-fluid rounded" style={{
                    maxHeight: "350px",objectFit: "cover", }}/>
              </div>

              {/* Details */}
              <div className="col-md-7">
                <div className="card-body p-4">
                  <span className="badge bg-secondary mb-3">{product.category} </span>
                  <h2 className="fw-bold mb-3"> {product.name} </h2>
                  <h3 className="text-primary mb-4">₹{product.price} </h3>
                  <div className="mb-3">
                    <strong> Product ID:</strong>
                    <span className="ms-2"> {product.id}</span>
                  </div>
                  <div className="mb-3">
                    <strong>Stock:</strong>
                    <span className="ms-2">
                      {product.stock === 0 ? (
                        <span className="badge bg-danger">Out of Stock </span>
                      ) : (
                        <span className="badge bg-success"> {product.stock} available </span>
                      )}
                    </span>
                  </div>
<p>
  <strong>Rating:</strong>{" "}
  <i className="bi bi-star-fill text-warning me-1"></i>
  {product.rating}
</p>                  <div className="mb-4">
                    <strong>Sales:</strong>
                    <span className="ms-2"> {product.sales || 0}</span>
                  </div>
                  <Link to={`/products/edit/${product.id}`}>
                    <button className="btn btn-warning">Edit Product</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;