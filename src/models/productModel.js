import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            text: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        prices: {
            type: Map,
            of: {
                price: Number,
                shippingFee: Number,
            },
            required: true,
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000,
            text: true,
        },
        category: {
            type: ObjectId,
            ref: "Category",
        },
        quantity: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
        },
        sold: {
            type: Number,
            default: 0,
        },
        profic: {
            type: Array,
        },
        color: {
            type: String,
        },
        gender:{
          type:String,
          enum:["mail","femail","both"]
        },
        ratings: [
            {
                star: Number,
                comment: String,
                postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            },
        ],
    },
    {
        collection: "products",
        timestamps: true,
    }
);

const ProductModel =
    mongoose.models.ProductModel || mongoose.model("ProductModel", productSchema);

export default ProductModel;

/*
import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        prices: { price: 0, shippingFee: 0 },
        description: '',
        category: '',
        quantity: 0,
        discount: 0,
        color: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://your-api-url/products', formData);
            alert('Product added successfully!');
            // Reset the form
            setFormData({
                title: '',
                prices: { price: 0, shippingFee: 0 },
                description: '',
                category: '',
                quantity: 0,
                discount: 0,
                color: '',
            });
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" />
            <input type="number" name="price" value={formData.prices.price} onChange={(e) => setFormData({ ...formData, prices: { ...formData.prices, price: e.target.value } })} placeholder="Price" />
            <input type="number" name="shippingFee" value={formData.prices.shippingFee} onChange={(e) => setFormData({ ...formData, prices: { ...formData.prices, shippingFee: e.target.value } })} placeholder="Shipping Fee" />
            <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount" />
            <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Color" />
            <button type="submit">Add Product</button>
        </form>
    );
};

export default AddProductForm;


*/