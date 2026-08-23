import { useEffect, useState } from "react";

function ProductForm({ initialData, onSubmit }) {
  const emptyForm = {
    name: "",
    category: "",
    price: "",
    stock: "",
    rating: "",
    image: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "",
        price: initialData.price ?? "",
        stock: initialData.stock ?? "",
        rating: initialData.rating ?? "",
        image: initialData.image || "",
      });
    } else {
      setFormData(emptyForm);
    }

    setErrors({});
  }, [initialData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,[name]: value,
    }));
    setErrors((previous) => ({
      ...previous,[name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.price === "") {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.stock === "") {
      newErrors.stock = "Stock is required";
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (formData.rating === "") {
      newErrors.rating = "Rating is required";
    } else if (Number(formData.rating) < 0 ||Number(formData.rating) > 5
    ) {
      newErrors.rating = "Rating must be between 0 and 5";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating),
      sales: initialData?.sales || 0,
    };
    onSubmit(productData);
  };

  const handleReset = () => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "",
        price: initialData.price ?? "",
        stock: initialData.stock ?? "",
        rating: initialData.rating ?? "",
        image: initialData.image || "",
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>

          {/* Product Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Name</label>
            <input type="text" name="name" className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}onChange={handleChange}placeholder="Enter product name"
            />
            {errors.name && (
              <div className="invalid-feedback"> {errors.name}</div>
            )}
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Category</label>

            <select name="category" className={`form-select ${errors.category ? "is-invalid" : ""}`}
              value={formData.category}onChange={handleChange}>
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Footwear">Footwear</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Home">Home</option>
            </select>

            {errors.category && (<div className="invalid-feedback">{errors.category}</div>
            )}
          </div>

          {/* Price */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Price</label>
            <input type="number" name="price" className={`form-control ${errors.price ? "is-invalid" : ""}`}
              value={formData.price} onChange={handleChange} placeholder="Enter price" min="0"/>

            {errors.price && (
              <div className="invalid-feedback">{errors.price}</div>         
            )}
          </div>

          {/* Stock */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Stock</label>

            <input type="number" name="stock" className={`form-control ${errors.stock ? "is-invalid" : ""}`}
              value={formData.stock} onChange={handleChange} placeholder="Enter stock"min="0"/>
            {errors.stock && (
              <div className="invalid-feedback">{errors.stock}</div>
            )}
          </div>

          {/* Rating */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Rating</label>
            <input type="number" name="rating" className={`form-control ${errors.rating ? "is-invalid" : ""}`}
              value={formData.rating} onChange={handleChange} placeholder="0 - 5" min="0" max="5"step="0.1"/>

            {errors.rating && (
              <div className="invalid-feedback">{errors.rating}</div>
            )}
          </div>

          {/* Image URL */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Image URL</label>

            <input type="url" name="image" className={`form-control ${errors.image ? "is-invalid" : ""}`}
              value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg"/>

            {errors.image && (
              <div className="invalid-feedback">{errors.image}</div>
            )}
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {initialData ? "Update Product" : "Add Product"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;