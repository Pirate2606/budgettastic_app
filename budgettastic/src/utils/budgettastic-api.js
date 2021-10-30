const request = require("request");

const ocr = (img_url, category, income, expenses, callback) => {
    const url =
        "https://budgettastic-api.herokuapp.com/analysis?url=" +
        img_url +
        "&cat=" +
        category +
        "&inc=" +
        income +
        "&exp=" +
        expenses;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback("Unable to connect to the budgettastic API!", undefined);
        } else {
            callback(undefined, body);
        }
    });
};

module.exports = ocr;
