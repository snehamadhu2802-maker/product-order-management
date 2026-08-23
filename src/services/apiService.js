import axios from "axios";

const API_URL = "http://localhost:3000";
export const getProducts = () => {
  return axios.get(`${API_URL}/products`);
};
export const getProduct = (id) => {
  return axios.get(`${API_URL}/products/${id}`);
};
export const getProductById = (id) => {
  return axios.get(`${API_URL}/products/${id}`);
};
export const addProduct = async (product) => {
  const response = await axios.get(`${API_URL}/products`);
  const products = response.data;
  const maxId = products.reduce((max, item) => {
    const id = Number(item.id);
    return id > max ? id : max;
  }, 0);

  // Next ID
  const nextId = maxId + 1;

  //Add product
  return axios.post(`${API_URL}/products`, {
    ...product,
    id: nextId
  });
};

export const updateProduct = (id, product) => {
  return axios.put(`${API_URL}/products/${id}`, product);
};
export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/products/${id}`);
};
export const getOrders = () => {
  return axios.get(`${API_URL}/orders`);
};
export const getOrder = (id) => {
  return axios.get(`${API_URL}/orders/${id}`);
};
export const getOrderById = (id) => {
  return axios.get(`${API_URL}/orders/${id}`);
};