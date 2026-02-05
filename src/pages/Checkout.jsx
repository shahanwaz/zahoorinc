
import React, { useState, useEffect } from "react";
import { Cart } from "@/entities/Cart";
import { Order } from "@/entities/Order";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, MapPin, Truck, CreditCard, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Checkout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: ""
  });

  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Pre-fill user data
      setAddressForm(prev => ({
        ...prev,
        name: user.full_name || "",
        phone: user.phone || ""
      }));
      
      const items = await Cart.filter({ user_id: user.id });
      setCartItems(items);
      
      if (items.length === 0) {
        navigate(createPageUrl("Cart"));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      navigate(createPageUrl("Cart"));
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    const deliveryCharges = deliveryOption === "express" ? 149 : subtotal > 999 ? 0 : 99;
    return { subtotal, deliveryCharges, total: subtotal + deliveryCharges };
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { subtotal, deliveryCharges, total } = calculateTotal();
      const orderNumber = `ZHR${Date.now()}`;
      
      // Create order
      const orderData = {
        user_id: currentUser.id,
        order_number: orderNumber,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          seller_name: item.seller_name,
          quantity: item.quantity,
          price: item.product_price
        })),
        subtotal,
        delivery_charges: deliveryCharges,
        total_amount: total,
        delivery_address: addressForm,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "cod" ? "pending" : "paid",
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      await Order.create(orderData);
      
      // Clear cart
      for (const item of cartItems) {
        await Cart.delete(item.id);
      }
      
      navigate(createPageUrl(`OrderConfirmation?orderNumber=${orderNumber}`));
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, deliveryCharges, total } = calculateTotal();

  const steps = [
    { id: 1, title: "Address", icon: MapPin },
    { id: 2, title: "Delivery", icon: Truck },
    { id: 3, title: "Payment", icon: CreditCard },
    { id: 4, title: "Review", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-emerald-200/50">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-4 hover:bg-emerald-50">
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <h1 className="text-xl font-bold text-emerald-900">Checkout</h1>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ml-2 ${currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4">
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-emerald-900 mb-4">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                  placeholder="House no, Building, Street, Area"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={addressForm.pincode}
                  onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-emerald-900 mb-4">Delivery Options</h2>
            <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="cursor-pointer">
                    <div>
                      <div className="font-semibold">Standard Delivery</div>
                      <div className="text-sm text-gray-600">5-7 business days</div>
                    </div>
                  </Label>
                </div>
                <span className="font-semibold text-emerald-800">
                  {subtotal > 999 ? 'FREE' : '₹99'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="cursor-pointer">
                    <div>
                      <div className="font-semibold">Express Delivery</div>
                      <div className="text-sm text-gray-600">2-3 business days</div>
                    </div>
                  </Label>
                </div>
                <span className="font-semibold text-emerald-800">₹149</span>
              </div>
            </RadioGroup>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-emerald-900 mb-4">Payment Method</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="cursor-pointer">UPI Payment</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking" className="cursor-pointer">Net Banking</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-emerald-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-emerald-900">{item.product_name}</h3>
                      <p className="text-sm text-emerald-600">Qty: {item.quantity}</p>
                      <p className="font-semibold">₹{item.product_price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-emerald-900 mb-2">Delivery Address</h3>
              <p className="text-emerald-700">
                {addressForm.name}<br />
                {addressForm.address}<br />
                {addressForm.pincode}<br />
                {addressForm.phone}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className="bg-white m-4 rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-emerald-900 mb-3">Price Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-emerald-200/50 p-4">
        {currentStep < 4 ? (
          <Button 
            onClick={() => setCurrentStep(currentStep + 1)}
            className="w-full primary-btn h-12 text-base font-semibold"
            disabled={
              (currentStep === 1 && (!addressForm.name || !addressForm.phone || !addressForm.address || !addressForm.pincode))
            }
          >
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full primary-btn h-12 text-base font-semibold"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        )}
      </div>
    </div>
  );
}
