import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {deleteProduct,getProducts,} from "../services/apiService";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stock, setStock] = useState("All");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Delete Product
  const handleDelete = useCallback(async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?");

    if (!confirmDelete) return;
    try {
      await deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }, []);

  // Categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set( products.map((product) => product.category)),];
    return ["All", ...uniqueCategories];
  }, [products]);

  // Search + Filter + Sort
  const filteredProducts = useMemo(() => {
    let result = [...products];
    // Search
    if (search.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Category Filter
    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    // Stock Filter
    if (stock === "In Stock") {
      result = result.filter((product) => Number(product.stock) > 0);
    }

    if (stock === "Out of Stock") {
      result = result.filter(
        (product) => Number(product.stock) === 0);
    }

    // Price Sort
    if (sort === "low") {
      result.sort((a, b) =>
          Number(a.price) - Number(b.price));
    }

    if (sort === "high") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price));
    }

    return result;
    }, [
      products,
      search,
      category,
      stock,
      sort,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex =(currentPage - 1) * productsPerPage;
  const currentProducts =filteredProducts.slice(startIndex,startIndex + productsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    category,
    stock,
    sort,
  ]);

  // Loading
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading... </span>
        </div>
        <p className="mt-3 text-muted"> Loading products... </p>
      </div>
    );
  }

  // UI
  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1"> Products</h2>
          <p className="text-muted mb-0"> Manage your store products</p>
        </div>
        <Link to="/products/add" className="btn btn-success" >
          <i className="bi bi-plus-lg me-2"></i> Add Product
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger"role="alert" >
          {error}
        </div>
      )}

      {/* Search & Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold"> Search </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input type="text"  className="form-control" placeholder="Search product name..." value={search}onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Category */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label fw-semibold">Category</label>
              <select className="form-select" value={category} onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label fw-semibold"> Stock</label>
              <select className="form-select" value={stock} onChange={(e) =>
                  setStock(e.target.value)
                }
              >
                <option value="All">All Stock</option>
                <option value="In Stock"> In Stock </option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            {/* Sort */}
            <div className="col-12 col-md-2">
              <label className="form-label fw-semibold"> Sort</label>
              <select className="form-select" value={sort} onChange={(e) =>
                  setSort(e.target.value)
                }
              >
                <option value=""> Price</option>
                <option value="low"> Low to High</option>
                <option value="high">High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="px-3">ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th> Price</th>
                  <th>Stock </th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <i className="bi bi-box-seam fs-1 text-muted"></i>
                      <p className="mt-2 mb-0 text-muted">
                        No products found
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product) => (<tr key={product.id}>
                      <td className="fw-semibold px-3"> {product.id}</td>
                      <td>{product.image ? (
                          <img src={product.image} alt={product.name} width="60" height="60" className="rounded object-fit-cover" />
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center"
                            style={{ width: "60px", height: "60px", }}
                          >
                            <i className="bi bi-image text-muted"></i>
                          </div>
                        )}

                      </td>
                      <td className="fw-semibold">{product.name}</td>
                      <td>
                        <span className="badge bg-secondary">{product.category}</span>
                      </td>
                      <td className="fw-semibold">₹
                        {Number(product.price).toLocaleString("en-IN")}</td>
                      <td>
                        {Number(product.stock) === 0 ? (
                          <span className="badge bg-danger"> Out of Stock </span>
                        ) : (
                          <span className="badge bg-success">{product.stock}</span>
                        )}
                      </td>

                      {/* Rating */}

                      <td>
                        <i className="bi bi-star-fill text-warning me-1"></i> {product.rating}</td>   

                      {/* Actions */}
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <Link to={`/products/${product.id}`} className="btn btn-sm btn-info text-white" >
                            <i className="bi bi-eye me-1"></i> View
                          </Link>
                          <Link to={`/products/edit/${product.id}`} className="btn btn-sm btn-warning" >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </Link>
                          <button type="button" className="btn btn-sm btn-danger" onClick={() =>
                              handleDelete( product.id )} >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4" aria-label="Product pagination" >
          <ul className="pagination justify-content-center flex-wrap">
            <li className={`page-item ${currentPage === 1 ? "disabled" : "" }`} >
              <button type="button" className="page-link" disabled={currentPage === 1} onClick={() =>
                  setCurrentPage( (prev) => prev - 1 ) }
              >
                ← Previous
              </button>
            </li>

            {/* Page Numbers */}
            {Array.from(
              { length: totalPages },
              (_, index) => index + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? "active" : "" }`} >
                <button type="button" className="page-link" onClick={() =>
                    setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}

            {/* Next */}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : "" }`} >
              <button type="button" className="page-link" disabled={ currentPage === totalPages } onClick={() =>
                  setCurrentPage( (prev) => prev + 1 )}>
                Next →
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Result Count */}
      <div className="text-center mt-3">
        <small className="text-muted">Showing{" "}
          <strong> {currentProducts.length} </strong>{" "}
          of{" "}
          <strong>{filteredProducts.length}
          </strong>{" "}products
        </small>
      </div>
    </div>
  );
}

export default Products;