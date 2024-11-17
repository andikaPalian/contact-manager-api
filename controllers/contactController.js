const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc Get all contacs
// @route GET /api/contacts
// @access Private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({user_id: req.user.id});
  res.status(200).json(contacts);
});

// @desc Create New contacs
// @route POST /api/contacts
// @access Private
const createContacts = asyncHandler(async (req, res) => {
  console.log("The request body is : ", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  };
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

// @desc Create New contact
// @route GET /api/contacts/:id
// @access Private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  };
  res.status(200).json(contact);
});

// @desc Update contact
// @route PUT /api/contacts/:id
// @access Private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  };
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user content");
  };
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

// @desc Delete contact
// @route DELETE /api/contacts/:id
// @access Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  };
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user content");
  };
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContacts,
  getContact,
  updateContact,
  deleteContact,
};
