import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [isAddMode, setIsAddMode] = useState(true)
  const [productId,setProductId]=useState("")
  const [cookie,setCookie,removeCookie]=useCookies(["auth"])
  const [auth,setAuth] = useState(null)
  
  
  const navigateTo  = useNavigate()

  
  const handleUpdate = () => {
  
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie?.auth}`,
      },
       body: JSON.stringify({
        id: productId,
        name: productName,
        price: productPrice,
      }),

    };

    fetch(`${import.meta.env.VITE_SERVER_URL}/update-item`, options)
      .then((response) => {
        if (response.ok) {
          toast.success("Product deleted successfully.");

      fetch(`${import.meta.env.VITE_SERVER_URL}/get-item`, {method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${cookie?.auth}`
      }})
      .then(async (response) => {
        return response.json()
      })
      .then((data) => {
        setProducts(data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("An error occurred while fetching products.");
      });

        } else {
          toast.error("Failed to delete product.");
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        toast.error("An error occurred while deleting product.");
      });



  };

  const handleDelete = (id) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${cookie?.auth}`,
      },
       body: JSON.stringify({
        id: id,
      }),

    };

    fetch(`${import.meta.env.VITE_SERVER_URL}/delete-item?id=${id}`, options)
      .then((response) => {
        if (response.ok) {
          toast.success("Product deleted successfully.");
          setProducts(products.filter((product) => product._id !== id));
        } else {
          toast.error("Failed to delete product.");
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        toast.error("An error occurred while deleting product.");
      });
  };

  useEffect(() => {
      if(!cookie?.auth){
       return navigateTo("/sign-up");
       }
    

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie?.auth}`,
      },
    };

    fetch(`${import.meta.env.VITE_SERVER_URL}/get-item`, options)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("An error occurred while fetching products.");
      });
  }, []);

  const handleAddProduct = () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie?.auth}`,
      },
      body: JSON.stringify({
        name: productName,
        price: productPrice,
      }),
    };

    fetch(`${import.meta.env.VITE_SERVER_URL}/add-item`, options)
      .then((response) => response.json())
      .then((data) => {
        setProducts([...products, data.data]);
        toast.success("Product added successfully.");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.error("An error occurred while adding product.");
      });

  
    setProductName("");
    setProductPrice("");
    setIsModalOpen(false);
  };

 const openAddModal = () => {
    setIsAddMode(true);
    setIsModalOpen(true);
    setProductId(null); 
    setProductName("");
    setProductPrice("");
  };

  const openEditModal = (id, name, price) => {
    setIsAddMode(false);
    setIsModalOpen(true);
    setProductId(id);
    setProductName(name);
    setProductPrice(price);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductId(null); 
    setProductName("");
    setProductPrice("");
  };

  const handleSubmit = () => {
    if (isAddMode) {
      handleAddProduct();
    } else {
      handleUpdate(productId);
    }
  };








 const handleLogout = () => {
    removeCookie("auth");
    navigateTo("/");
  };
  

   return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product List</h1>
        <h1 className="text-red-900 hover:cursor-pointer"  onClick={handleLogout}>Log out</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Product
        </button>
      </div>
      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[400px] lg:w-[550px]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      {isAddMode ? "Add Product" : "Edit Product"}
                    </h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full h-10 shadow-sm focus:ring-indigo-500 focus:border-transparent block sm:text-sm border-gray-300 rounded-md mb-4 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="w-full h-10 shadow-sm focus:ring-indigo-500 focus:border-transparent block sm:text-sm border-gray-300 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={()=>{
                    handleSubmit()
                  }}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isAddMode ? "Add" : "Save Changes"}
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
          <div key={product._id} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-500">Price: ${product.price}</p>
            <div className="flex justify-between items-center">
              <button
                className="text-green-500 mr-2"
                onClick={() => openEditModal(product?._id,product?.name,product?.price)} // Open modal in "Edit" mode
              >
                Edit
              </button>
              <button
                className="text-red-500"
                onClick={() => {
                  handleDelete(product._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
