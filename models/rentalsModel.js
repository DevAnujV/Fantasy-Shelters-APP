const mongoose = require("mongoose")

const rentalsSchema = new mongoose.Schema({
    headline: {
        type: String
    },
    numSleeps: {
        type: Number
    },
    numBedrooms: Number,
    numBathrooms: {
        type:Number
    },
    pricePerNight: Number,
    city: String,
    province: String,
    imageUrl: String,
    featuredRental: Boolean
})

const rentalsModel = mongoose.model("Rental", rentalsSchema)

module.exports = rentalsModel;