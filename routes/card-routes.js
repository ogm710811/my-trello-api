const express    = require('express');
const mongoose   = require('mongoose');
const ListModel  = require('../models/list-model');
const CardModel  = require('../models/card-model');

const cardRoutes = express.Router();
/*
    Card

    Method	Action	        Description
    POST	createCard	    It will create a card new inside
    PUT	    editCard	    It will edit the indicated card
    PUT	    transferCard	It will move a card from one list to another
    DELETE	removeCard	    It will remove a card from the database

    The editCard method will be a bit special in our application, as it can be called in two different situations:
    -> When we edit a card’s information.
    -> When we change the card’s position inside the same list.
*/

// POST	createCard will create a card new inside
cardRoutes.post('/api/lists/:id/cards', (req, res, next) => {
    CardModel
        .findOne({ list: req.params.id })
        .sort({ position: -1 }) //sorted in decending order (3, 2, 1)
        .exec((err, lastCard) => {
            if (err) {
                res.status(500).json({ message: 'unable to find card' });
                return;
            }

            // if this list doesn't have cards
            // the default position will be 1
            let newPosition = 1;

            // if we have cars then look for the last card position
            // and add 1 to set the position of the new card
            if (lastCard) {
                newPosition = lastCard.position + 1;
            }

            // then create new card
            const newCard = new CardModel({
                title:          req.body.cardTitle,
                description:    req.body.cardDescription,
                dueDate:        req.body.cardDueDate,
                position:       newPosition,
                list:           req.params.id
            });

            newCard.save((err) => {
                if (err) {
                    res.status(500).json({ message: 'unable to save card' });
                    return;
                }
                // update the corresponding list
                // pushing the card id into the card array in the list
                ListModel.findByIdAndUpdate({ _id: req.params.id },
                    { $push: { cards: newCard._id } },
                    (err, updatedList) => {
                        if (err) {
                            res.status(500).json({ message: 'unable to update the list' });
                            return;
                        }

                        res.status(200).json({
                            newCard,
                            message: `card ${ newCard._id } successfully save`
                        });
                    }
                );
            });
        });
}); // ends POSTcreateCard

// PUT editCard will edit the indicated card
cardRoutes.put('/api/cards/:id', (req, res, next) => {
    CardModel
        .findById(
            req.params.id,
            (err, editedCard) => {
                if (err) {
                    res.status(500).json({ message: 'unable to find card' });
                    return;
                }

                // we separate if conditions to avoid blanking fields
                // in case user doesn't enter one input field
                if (req.body.cardTitle) {
                    editedCard.title = req.body.cardTitle;
                }
                if (req.body.cardDescription) {
                    editedCard.description = req.body.cardDescription;
                }
                if (req.body.cardDueDate) {
                    cardFromDB.dueDate = req.body.cardDueDate;
                }

                // then now save the updated card
                editedCard.save((err) => {
                    if (err) {
                        res.status(500).json({ message: 'unable to update the card' });
                        return;
                    }

                    res.status(200).json({
                        editedCard,
                        message: `card ${ editedCard._id } successfully save`
                    });
                });
            }
        );
}); // ends PUT editCard

// PUT transferCard will move a card from one list to another
// cardRoutes.put('api/cards/:id/transfer', (req, res, next) => {
//     CardModel
//         .findByIdAndUpdate(
//             req.params.id,
//             (err, transferCard) => {
//                 if(err) {
//                     return res.status(400).json({ message: 'unable to update card', error: err });
//                 }

//             }
//         )

// });


// DELETE removeCard will remove a card from the database
cardRoutes.delete('/api/cards/:id', (req, res, next) => {
    CardModel
        .findByIdAndRemove(
            req.params.id,
            (err, deleteCard) => {
                if (err) {
                    res.status(500).json({ message: 'unable to delete card' });
                    return;
                }
                ListModel.findByIdAndUpdate(
                    deleteCard.list,
                    { $pull: { cards: deleteCard._id } },
                    (err) => {
                        if (err) {
                            res.status(500).json({ message: 'unable to delete card from list' });
                            return;
                        }
                        res.status(200).json({
                            deleteCard,
                            message: `card ${ deleteCard._id } successfully deleted`
                        });
                    }
                );
            }
        );
    });// ends DELETE removeCard

module.exports = cardRoutes;