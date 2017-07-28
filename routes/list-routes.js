const express    = require('express');
const mongoose   = require('mongoose');
const listRoutes = express.Router();

/*
    List

    Method  Action		Description
    GET	    getLists	It will load all the lists from the database
    POST	createList	It will create a new list
    PUT	    editList	It will edit a list
    DELETE	removeList	It will remove a list from the database

    As in the card, the editList method will be called in two different situations:
    -> When we edit a list’s information.
    -> When we change the list’s position in our board.
*/


















module.exports = listRoutes;