const express    = require('express');
const mongoose   = require('mongoose');
const ListModel = require('../models/list-model');
const CardModel = require('../models/card-model');

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

// GET getLists will load all the lists from the database
listRoutes.get('/api/lists', (req, res, next) => {
    ListModel
        .find()
        .populate('cards')  // <-- populate display all information of the cards 
                            //    otherwise the query only returns the card._id
        .exec((err, allLists) => {
            if (err) {
                res.status(500).json({ message: 'unable to find the lists' });
                return;
            }
            res.status(200).json(allLists);
        });
});// ends GET getLists

// POST createList will create a new list
listRoutes.post('/api/lists', (req, res, next) => {
    ListModel
        .findOne({ title: req.body.listTitle })
        .sort({ position: -1 })
        .exec((err, lastList) => {
            if (err) {
                res.status(500).json({ message: 'unable to find the list' });
                return;
            }

            // if we don't have list
            // the default position will be 1
            let newPosition = 1;

            // if we have lists then look for the last list position
            // and add 1 to set the position of the new list
            if (lastList) {
                newPosition = lastCard.position + 1;
            }

            const newList = new ListModel({
                title: req.body.listTitle,
                position: newPosition,
            });

            newList.save((err) => {
                if (err) {
                    res.status(500).json({ message: 'unable to save the list' });
                    return;
                }
            });

            res.status({
                newList,
                message: `list ${ newList._id } successfully save`
            });
        });
});// ends POST createList

// PUT editList will edit a list
listRoutes.put('/api/list/:id', (req, res, next) => {
    ListModel
        .findById(
            req.body.id,
            (err, editedList) => {
                if (err) {
                    res.status(500).json({ message: 'unable to find card' });
                    return;
                }

                // we separate if conditions to avoid blanking fields
                // in case user doesn't enter one input field
                if (req.body.listTitle) {
                    editedList.title = req.body.listTitle;
                }

                // then now save the updated list
                editedList.save((err) => {
                    if (err) {
                        res.status(500).json({ message: 'unable to update the list' });
                        return;
                    }

                    res.status(200).json({
                        editedList,
                        message: `list ${ editedList._id } successfully save`
                    });
                });
            }
        );
}); // ends PUT editList


// DELETE removeList will remove a list from the database
listRoutes.delete('api/lists/:id', (req, res, next) => {
    ListModel
        .findByIdAndRemove(
            req.params.id,
            (err, deleteList) => {
                if (err) {
                    res.status(500).json({ message: 'unable to delete list' });
                    return;
                }

                res.status(200).json({
                    deleteList,
                    message: `list ${ deleteList._id } successfully deleted`
                });
            }
        );
});// ends DELETE removeList


module.exports = listRoutes;