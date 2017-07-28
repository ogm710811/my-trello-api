/* jshint node: true */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new mongoose.Schema({  
// the feature we will implement.
  title: {
    type: String,
    require: true
  },

// how we are going to implement a feature.
  description: String,

// will indicate the date it has to be done.
  dueDate: Date,

// position of the card inside a list.
  position: Number,
  
// list will be a reference to the List ObjectId where we have the card.
  list: {
    type: Schema.Types.ObjectId,
    ref: 'List',
    require: true
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

module.exports = mongoose.model('Card', cardSchema);  