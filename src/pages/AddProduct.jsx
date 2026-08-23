import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { addProduct } from "../services/apiService";

function AddProduct() {
  const navigate = useNavigate();
  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      alert("Product added successfully!");
      navigate("/products");
    } catch (error) {
      alert("Failed to add product");
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold">Add Product</h1>
        <p className="text-muted">Add a new product to your store</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <ProductForm onSubmit={handleAddProduct}/>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;