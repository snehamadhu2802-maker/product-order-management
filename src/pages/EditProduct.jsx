import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import {getProduct,updateProduct,} from "../services/apiService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data);
      } catch (error) {
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdateProduct = async (productData) => {
    try {
      await updateProduct(id, productData);
      alert("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      alert("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-4">
        <h2>Product not found</h2>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold">Edit Product</h1>
        <p className="text-muted">Update product information</p>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <ProductForm initialData={product} onSubmit={handleUpdateProduct}/>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;