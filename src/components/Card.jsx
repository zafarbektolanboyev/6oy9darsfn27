import React, { useEffect, useState, useRef } from 'react';
import './Card.css';

function Card() {
  const token = localStorage.getItem('accessToken');
  const [products, setProducts] = useState([]);
  const nameRef = useRef();
  const priceRef = useRef();
  const descriptionRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('https://auth-rg69.onrender.com/api/products/private/all', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [token]);

  function handleSubmit(e){
    e.preventDefault();

    const newProduct = {
      name: nameRef.current.value,
      price: parseFloat(priceRef.current.value),
      description: descriptionRef.current.value,
    };

    fetch('https://auth-rg69.onrender.com/api/products/private', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add product');
        }
        return response.json();
      })
      .then(data => {
        setProducts(prevProducts => [...prevProducts, data]); 
        nameRef.current.value = '';
        priceRef.current.value = '';
        descriptionRef.current.value = '';
        setErrorMessage('');
      })
      .catch(error => {
        setErrorMessage('Error adding product: ' + error.message);
      });
  };
  function handleDel(id) {
    fetch(`https://auth-rg69.onrender.com/api/products/private/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete product: ' + response.statusText); 
        }
        return response.json();
      })
      .then(() => {
        
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        alert('Product deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
      });
  }
  
  
  
  return (
    <div>
      <h1>Product List</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          ref={nameRef}
          type="text"
          placeholder="Product Name"
        />
        <input
          ref={priceRef}
          type="number"
          placeholder="Product Price"
        />
        <textarea
          ref={descriptionRef}
          placeholder="Product Description"
        />
        <button type="submit">Add Product</button>
      </form>

      <div className="card-container">
        {products.map((product, index) => (
          <div className="card" key={index}>
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Description: {product.description}</p>
            <button onClick={handleDel}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
