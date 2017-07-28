/* jshint node: true */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new mongoose.Schema({
  // Lesson 2: Implement the List Model
  title: {
    type: String,
    require: true
  },
  position: {
    type: Number,
    default: 0
  },
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Card'
    }
  ]
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

module.exports = mongoose.model('List', listSchema);