import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonList, IonItem, IonLabel, IonInput } from '@ionic/react';

import "./Home.css"
// Define the type for the data items
interface DataItem {
  id: string;
  name: string;
  description: string;
}

const Home: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');

  useEffect(() => {
    // Fetch data from API and set it to the state
    fetch('http://localhost:3000/api/items')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const getProducts = () => {
    fetch('http://localhost:3000/api/items')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error))
  }
  const handleFindButton = () => {
    setShowModal(true);
  };
  const handleCreateButton = () => {
    setShowModalProduct(true);
  };

  const handleInputChange = (event: CustomEvent) => {
    const value = (event.target as HTMLInputElement).value;
    setInputValue(value);
  };

  const fetchFilteredData = () => {
    const data = {
      id: inputValue,
    }
    fetch('http://localhost:3000/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Corrected syntax
    })
      .then(response => response.json())
      .then(data => {
        getProducts(); // Assuming this function refreshes the product list
        console.log('Product eliminated:', data);
        setInputValue(''); // Clear the input value after deletion
        setShowModal(false); // Close the modal after deletion
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  const handleProductNameChange = (event: CustomEvent) => {
    const value = (event.target as HTMLInputElement).value;
    setProductName(value);
  };

  const handleProductDescriptionChange = (event: CustomEvent) => {
    const value = (event.target as HTMLInputElement).value;
    setProductDescription(value);
  };
  const handleSubmit = () => {
    const productData = {
      name: productName,
      description: productDescription,
    };

    fetch('http://localhost:3000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })
      .then(response => response.json())
      .then(data => {
        getProducts();
        console.log('Product created:', data);
        setProductName('');
        setProductDescription('');
        setShowModalProduct(false);
      })
      .catch(error => console.error('Error creating product:', error));
  };

  useEffect(() => {
    if (inputValue) {
      fetchFilteredData();
    }
  }, [inputValue]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestor de productos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">tool</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={handleFindButton}>Eliminar producto</IonButton>
        <IonButton onClick={handleCreateButton}>Crear producto </IonButton>
        <div>
          <h1>Productos</h1>
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Eliminar Producto</IonTitle>
              <IonButton slot="end" onClick={() => setShowModal(false)}>Close</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonInput
              value={inputValue}
              placeholder="Ingresar id Producto a eliminar"
              onIonChange={handleInputChange}
            />
            <IonButton onClick={fetchFilteredData}>Submit</IonButton>

          </IonContent>
        </IonModal>
        <IonModal isOpen={showModalProduct} onDidDismiss={() => setShowModalProduct(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Crear producto</IonTitle>
              <IonButton slot="end" onClick={() => setShowModalProduct(false)}>Close</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonInput
              value={productName}
              placeholder="Ingresar nombre Producto"
              onIonChange={handleProductNameChange}
            />
            <IonInput
              value={productDescription}
              placeholder="Ingresar descripción"
              onIonChange={handleProductDescriptionChange}
            />
            <IonButton onClick={handleSubmit}>Submit</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;