const cors = require('cors');
const express = require('express');

module.exports = (app) => {
    app.use(cors({
        origin: ['http://localhost:3000', 'https://listadamamae.netlify.app'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'] 
    }));
    
    app.use(express.json());
};