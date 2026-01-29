const express = require('express');
const router = express.Router();
const data = require('../models/roomModels');



// GET Routes for /rooms with optional filtering
router.get('/rooms', (req, res) => {
    const { location, maxPrice, type, isAvailable } = req.query; // Updated query parameters
    let filteredRooms = data // Assume 'data' is an array of all room objects
        .filter(
            (room) => !location || room.location.toLowerCase() === location.toLowerCase(),
        )
        .filter((room) => !maxPrice || room.price <= parseFloat(maxPrice))
        .filter(
            (room) => !type || room.type.toLowerCase().includes(type.toLowerCase()),
        )
        .filter(
            (room) =>
                isAvailable === undefined || (isAvailable === 'true' && room.isAvailable),
        );

    return filteredRooms.length === 0
        ? res.status(404).json({
            status: 404,
            message: 'No rooms found matching the criteria',
            data: filteredRooms,
        })
        : res.status(200).json({
            status: 200,
            message: 'Retrieved rooms successfully',
            data: filteredRooms,
        });
});




// POST Routes for /rooms
router.post('/rooms', (req, res) => {
    const { location, price } = req.body;

    if (!location || !price) {
        return res.status(400).json({
            status: 400,
            message: 'Bad Request: Location and Price are required',
            data: null,
        });
    }


    const newItem = { id: data.length + 1, ...req.body };
    data.push(newItem);

    res.status(201).json({
        status: 201,
        message: 'Room created successfully',
        data: newItem,
    });
});

// PUT Routes for /rooms/:id
router.put('/rooms/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = data.findIndex((d) => d.id === id);

    if (index === -1) {
        return res.status(404).json({
            status: 404,

            message: `Room with ID ${id} not found`,
            data: null,
        });
    }


    data[index] = { id, ...req.body };

    res.status(200).json({
        status: 200,
        message: 'Room updated successfully',
        data: data[index],
    });
});


// DELETE Routes for /rooms/:id
router.delete('/rooms/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = data.findIndex((d) => d.id === id);

    if (index === -1) {
        return res.status(404).json({
            status: 404,

            message: `Room with ID ${id} not found`,
            data: null,
        });
    }


    data.splice(index, 1);

    res.status(203).json({
        status: 203,
        message: 'Room deleted successfully',
        data: null,
    });
});






module.exports = router;