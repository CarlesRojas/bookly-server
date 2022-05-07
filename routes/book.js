// Get express Router
const router = require("express").Router();

// Object id type
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Token verification
const verify = require("./verifyToken");

// Dot env constants
const dotenv = require("dotenv");
dotenv.config();

// Get the Validation schemas
const { changeStatusValidation, changeScoreValidation, changeFinishDateValidation } = require("../validation");

// Get the schemes
const User = require("../models/User");
const Book = require("../models/Book");

router.post("/changeStatus", verify, async (request, response) => {
    // Validate data
    const { error } = changeStatusValidation(request.body);

    // If there is a validation error
    if (error) return response.status(422).json({ error: error.details[0].message });

    try {
        // Deconstruct request
        const { _id } = request;
        const { bookId, status, month, year } = request.body;

        // Get user
        const user = await User.findOne({ _id });
        if (!user) return response.status(404).json({ error: "User does not exist" });

        // Get Book
        const book = await Book.findOne({ userId: _id, bookId });

        let updatedBook = null;

        // If user wants to remove the book
        if (book && status === "remove") {
            await Book.deleteOne({ userId: _id, bookId });
        }

        // Change book status
        else if (book) {
            updatedBook = await Book.findOneAndUpdate(
                { userId: _id, bookId },
                {
                    $set: {
                        status,
                        monthFinished: status === "finished" ? month : null,
                        yearFinished: status === "finished" ? year : null,
                    },
                },
                { new: true }
            );
        }

        // If the user adds the book for the first time
        else {
            const book = new Book({
                userId: _id,
                bookId,
                status: status,
                score: 0,
                monthFinished: status === "finished" ? month : null,
                yearFinished: status === "finished" ? year : null,
            });

            // Save book to DB
            updatedBook = await book.save();
        }

        response.status(200).json(updatedBook);
    } catch (error) {
        // Return error
        response.status(500).json({ error });
    }
});

router.post("/changeScore", verify, async (request, response) => {
    // Validate data
    const { error } = changeScoreValidation(request.body);

    // If there is a validation error
    if (error) return response.status(422).json({ error: error.details[0].message });

    try {
        // Deconstruct requests<
        const { _id } = request;
        const { bookId, score } = request.body;

        // Get user
        const user = await User.findOne({ _id });
        if (!user) return response.status(404).json({ error: "User does not exist" });

        // Get Book
        const book = await Book.findOne({ userId: _id, bookId });
        if (!book) return response.status(404).json({ error: "Can't score a book without reading it." });

        // Update Book
        const updatedBook = await Book.findOneAndUpdate({ userId: _id, bookId }, { $set: { score } }, { new: true });

        response.status(200).json(updatedBook);
    } catch (error) {
        // Return error
        response.status(500).json({ error });
    }
});

router.post("/changeFinishDate", verify, async (request, response) => {
    // Validate data
    const { error } = changeFinishDateValidation(request.body);

    // If there is a validation error
    if (error) return response.status(422).json({ error: error.details[0].message });

    try {
        // Deconstruct request
        const { _id } = request;
        const { bookId, month, year } = request.body;

        // Get user
        const user = await User.findOne({ _id });
        if (!user) return response.status(404).json({ error: "User does not exist" });

        // Get Book
        const book = await Book.findOne({ userId: _id, bookId });
        if (!book) return response.status(404).json({ error: "Can't score a book without reading it." });

        const today = new Date();
        const currentMonth = today.getUTCMonth();
        const currentYear = today.getUTCFullYear();

        if (year > currentYear || (year === currentYear && month > currentMonth))
            return response.status(404).json({ error: "The date can not be in the future." });

        // Update Book
        const updatedBook = await Book.findOneAndUpdate(
            { userId: _id, bookId },
            { $set: { monthFinished: month, yearFinished: year } },
            { new: true }
        );

        response.status(200).json(updatedBook);
    } catch (error) {
        // Return error
        response.status(500).json({ error });
    }
});

router.get("/getAll", verify, async (request, response) => {
    try {
        // Deconstruct request
        const { _id } = request;

        // Get user
        const user = await User.findOne({ _id });
        if (!user) return response.status(404).json({ error: "User does not exist" });

        // Get all entries for user
        const books = await Book.aggregate([{ $match: { userId: ObjectId(_id) } }]);

        response.status(200).json({ books });
    } catch (error) {
        // Return error
        response.status(500).json({ error });
    }
});

module.exports = router;
