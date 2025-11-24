import React, { useState, useContext } from "react";
import AccountSidebar from '../../components/AccountSidebar';
import { MyContext } from '../../App';
import { Button } from "@mui/material";
import { IoEyeOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const MyOrders = () => {
    const context = useContext(MyContext);
    
    const [userInfo, setUserInfo] = useState({
        fullName: 'User Full Name',
        email: 'example@example.com',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV1Mly7C6D_WWpPXTAO4dF52D9Wd9FKuC9zw&s'
    });

    const [orders] = useState([
        {
            id: '#ORD-2024-001',
            paymentId: 'PAY-123456789',
            products: [
                { 
                    productId: 'PROD-001',
                    name: 'A-Line Kurti With Sharara',
                    image: 'https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg',
                    qty: 2,
                    price: 45.00
                },
                { 
                    productId: 'PROD-002',
                    name: 'Women Ethnic Dress',
                    image: 'https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg',
                    qty: 1,
                    price: 66.00
                }
            ],
            name: 'John Doe',
            phoneNumber: '+1 234 567 8900',
            address: '123 Main Street, Apartment 4B',
            pincode: '10001',
            totalAmount: 156.00,
            userId: 'USER-001',
            status: 'Delivered',
            date: '2024-11-20'
        },
        {
            id: '#ORD-2024-002',
            paymentId: 'PAY-987654321',
            products: [
                { 
                    productId: 'PROD-003',
                    name: 'Casual T-Shirt',
                    image: 'https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg',
                    qty: 1,
                    price: 25.00
                },
                { 
                    productId: 'PROD-004',
                    name: 'Denim Jeans',
                    image: 'https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg',
                    qty: 3,
                    price: 21.33
                }
            ],
            name: 'Jane Smith',
            phoneNumber: '+1 234 567 8901',
            address: '456 Oak Avenue, Suite 12',
            pincode: '10002',
            totalAmount: 89.00,
            userId: 'USER-002',
            status: 'Shipping',
            date: '2024-11-22'
        },
        {
            id: '#ORD-2024-003',
            paymentId: 'PAY-456789123',
            products: [
                { 
                    productId: 'PROD-005',
                    name: 'Summer Dress',
                    image: 'https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg',
                    qty: 2,
                    price: 55.00
                },
                { 
                    productId: 'PROD-006',
                    name: 'Leather Jacket',
                    image: 'https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg',
                    qty: 1,
                    price: 120.00
                },
                { 
                    productId: 'PROD-007',
                    name: 'Sports Shoes',
                    image: 'https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg',
                    qty: 2,
                    price: 7.50
                }
            ],
            name: 'Mike Johnson',
            phoneNumber: '+1 234 567 8902',
            address: '789 Pine Road, House 5',
            pincode: '10003',
            totalAmount: 245.00,
            userId: 'USER-003',
            status: 'Processing',
            date: '2024-11-24'
        }
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [expandedRows, setExpandedRows] = useState([]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo({ ...userInfo, avatar: reader.result });
                context.openAlertBox("success", "Avatar updated successfully!");
            };
            reader.readAsDataURL(file);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Shipping': return 'bg-blue-100 text-blue-700';
            case 'Processing': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const getTotalItems = (products) => {
        return products.reduce((sum, product) => sum + product.qty, 0);
    };

    const toggleExpandRow = (orderId) => {
        setExpandedRows(prev => {
            if (prev.includes(orderId)) {
                return prev.filter(id => id !== orderId);
            } else {
                return [...prev, orderId];
            }
        });
    };

    const isRowExpanded = (orderId) => {
        return expandedRows.includes(orderId);
    };

    const calculateSubTotal = (price, qty) => {
        return (price * qty).toFixed(2);
    };

    return (
        <section className="section py-10">
            <div className="container flex gap-5">
                {/* Sidebar */}
                <div className='col1 w-[25%]'>
                    <AccountSidebar 
                        userInfo={userInfo} 
                        onAvatarChange={handleAvatarChange}
                    />
                </div>

                {/* Main Content */}
                <div className="col2 w-[75%]">
                    <div className="card bg-white shadow-md rounded-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className='text-[22px] font-bold'>My Orders</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Total {orders.length} orders found
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold w-10"></th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Payment ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Products</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Pincode</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Total Amount</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">User ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            {/* Main Row */}
                                            <tr className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => toggleExpandRow(order.id)}
                                                        className="text-gray-600 hover:text-primary transition-colors"
                                                    >
                                                        {isRowExpanded(order.id) ? (
                                                            <FaAngleUp className="text-[18px]" />
                                                        ) : (
                                                            <FaAngleDown className="text-[18px]" />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-4 text-sm font-medium text-primary">
                                                    {order.id}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {order.paymentId}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {getTotalItems(order.products)} items
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {order.name}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {order.phoneNumber}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 max-w-[150px] truncate">
                                                    {order.address}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {order.pincode}
                                                </td>
                                                <td className="px-4 py-4 text-sm font-semibold">
                                                    ${order.totalAmount.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {order.userId}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {new Date(order.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Button 
                                                        className="btn-sm btn-outline flex items-center gap-1"
                                                        onClick={() => handleViewOrder(order)}
                                                    >
                                                        <IoEyeOutline className="text-[16px]"/>
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>

                                            {/* Expanded Row - Product Details */}
                                            {isRowExpanded(order.id) && (
                                                <tr>
                                                    <td colSpan="13" className="p-0 bg-gray-50">
                                                        <div className="p-4">
                                                            <h4 className="font-semibold mb-3 text-[15px]">Product Details:</h4>
                                                            <table className="w-full bg-white rounded shadow-sm">
                                                                <thead className="bg-gray-100">
                                                                    <tr>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold">Product ID</th>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold">Product Title</th>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold">Image</th>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold">Quantity</th>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold">SubTotal</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {order.products.map((product, index) => (
                                                                        <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                                                                            <td className="px-4 py-3 text-sm text-primary font-medium">
                                                                                {product.productId}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm font-medium">
                                                                                {product.name}
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                <img 
                                                                                    src={product.image} 
                                                                                    alt={product.name}
                                                                                    className="w-[50px] h-[50px] object-cover rounded"
                                                                                />
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-center">
                                                                                <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                                                    {product.qty}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm font-semibold">
                                                                                ${product.price.toFixed(2)}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm font-bold text-primary">
                                                                                ${calculateSubTotal(product.price, product.qty)}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                                <tfoot className="bg-gray-50">
                                                                    <tr>
                                                                        <td colSpan="5" className="px-4 py-3 text-right font-semibold">
                                                                            Total:
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm font-bold text-primary text-[16px]">
                                                                            ${order.totalAmount.toFixed(2)}
                                                                        </td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {orders.length === 0 && (
                            <div className="text-center py-10">
                                <img 
                                    src="/empty-orders.png" 
                                    alt="No Orders" 
                                    className="w-[200px] mx-auto mb-4 opacity-50"
                                />
                                <h3 className="text-[18px] font-semibold text-gray-600 mb-2">
                                    No orders yet
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    You haven't placed any orders yet. Start shopping now!
                                </p>
                                <Button 
                                    className="btn-org"
                                    onClick={() => window.location.href = '/'}
                                >
                                    Start Shopping
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Order Details</h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Order ID</p>
                                    <p className="font-semibold text-primary">{selectedOrder.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment ID</p>
                                    <p className="font-semibold">{selectedOrder.paymentId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Order Date</p>
                                    <p className="font-semibold">
                                        {new Date(selectedOrder.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Customer Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold">{selectedOrder.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold">{selectedOrder.phoneNumber}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-semibold">{selectedOrder.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pincode</p>
                                        <p className="font-semibold">{selectedOrder.pincode}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">User ID</p>
                                        <p className="font-semibold">{selectedOrder.userId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Products</h4>
                                <div className="space-y-2">
                                    {selectedOrder.products.map((product, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                                <span>{product.name}</span>
                                            </div>
                                            <span className="text-gray-600">Qty: {product.qty}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-lg">Total Amount</h4>
                                    <p className="text-2xl font-bold text-primary">
                                        ${selectedOrder.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <Button 
                                className="btn-outline"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </Button>
                            <Button className="btn-org">
                                Track Order
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default MyOrders;