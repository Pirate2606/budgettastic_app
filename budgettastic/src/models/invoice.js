const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
        },

        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

        invoice_image: {
            type: String,
            required: true,
            default: "invoice_image",
        },
        cost: {
            type: Number,
            default: 0,
        },
    },

    {
        timestamps: true,
    }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
