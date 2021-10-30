# BUDGETTASTIC – YOUR ML POWERED BUDGET MANAGER

## Introduction:
Managing your monthly expenditure can be difficult at times. Therefore, through my project, I aim at helping people in managing their expenses. I have used a Machine Learning and Data Analysis Algorithms that study a huge dataset of over 40,000+ families’ category-wise monthly expenditure, categorized by their monthly incomes/budgets. The user uploads an image of the invoice along with the category of the bill. Algorith read the details of the invoice using OCR and then the API analyses the expenses and provides the user with a comprehensive feedback, which will help them manage their expenditure for the month. One of my objectives of building this website was to gain some knowledge about the fintech space and add up on my current skill set. I have tried my best to build this website as well as I could. The website is fully responsive with the help of Bootstrap 4. JavaScript and Python power the backend of the website and I have used MongoDB for the database needs. After the campaign, I would love to further develop the project and make it better.

## Budgettastic API:
I have created an API that takes the URL of the image of the invoice, income of the person, category of the invoice and the category expense of the month. Then, it perform OCR on the invoice to extract details from the invoice. After reading the invoice data, the total expenditure of the person is processed considering a data set of 40,000+ families. After doing all these operations, the API returns the response to the Node application. The response contains details like total bill amount, item details, item prices and quantities, and comprehensive analysis like whether the expenditure exceeds the average expenditure of a family within that income range.

### Endpoints

    https://budgettastic-api.herokuapp.com/analysis?url=<IMAGE_URL>&cat=<CATEGORY>&inc=<INCOME>&exp=<CURRENT_EXPENSES>
    Example URL: https://budgettastic-api.herokuapp.com/analysis?url=https://i.ibb.co/CQ0th2r/test1.jpg&cat=food&inc=20000&exp=450

#### Parameters to be passed in the URL:

    IMAGE_URL: Downloadable image URL. eg: https://i.ibb.co/CQ0th2r/test1.jpg
    CATEGORY can be any one of these: ['food', 'green_grocery', 'hotels', 'alcohol', 'clothes', 'house', 'health', 'education', 'special_occasion']
    INCOME >= 10000
    EXPENSES: Total expenses of the family for a particular category.

### Output

    {
      "subtotal": 4500.0,
      "total_tax": 0,
      "total": 4500.0,
      "payment_type": "cash",
      "currency_code": "INR",
      "date": "2012-01-27 12:18:00",
      "items_bought": {
          "0": {
              "name": "Chivas Regal",
              "price": 325.0,
              "quantity": 2.0,
              "total": 650.0
          },
          "1": {
              "name": "Jw Black Lable",
              "price": 600.0,
              "quantity": 2.0,
              "total": 1200.0
          },
          "2": {
              "name": "Chicken Drumsticks",
              "price": 180.0,
              "quantity": 1.0,
              "total": 180.0
          }
      },
      "vendor_details": {
          "address": "101 Rocking Avenue\nSuit # 305\nKolkata-700007",
          "category": "",
          "email": "",
          "name": "Fusion",
          "phone_number": "91-33-2534-5061",
          "raw_name": "Fusion",
          "vendor_type": ""
      },
      "new_expense": 4950.0,
      "more_than_average": false,
      "average_expense_diff": 12017.771300448432
    }

# Instructions:

## Prerequisites:
    1. NodeJS should be installed on the system.
    2. Python3 should be installed on the system.
    3. An active internet connection.

## To run the project locally, follow these steps:
    1. Clone the repository: git clone https://github.com/Pirate2606/budgettastic_app
    2. Change the directory: cd budgettastic_app/budgettastic
    3. Initialize npm in the project directory: npm init -y
    4. Install the node modules: npm i
    5. Generate OAuth Client ID and Secret for Google and Github.
    6. Place the Client IDs and Secrets in a .env file in the root of the project.
    7. Change the base URL of google.js and github.js OAuth files to https://budgettastic.herokuapp.com/{google/github}/callback
    8. Run the server using: npm run dev
    9. Open this link in browser: http://127.0.0.1:3000/

### For setting up API:
    1. Setup a virtual environment:
        For ubuntu:
            1. sudo apt install virtualenv
            2. virtualenv -p python3 name_of_environment
            3. To activate: source name_of_environment/bin/activate
        For windows:
            1.	pip install virtualenv
            2.	python -m venv <path for creating virtualenv>
            3.	To activate: <virtualenv path>\Scripts\activate

    2. Clone the repository: git clone https://github.com/Pirate2606/budgettastic_app
    3. Change the directory: cd budgettastic_app/api
    4. Install the requirements: pip install -r requirements.txt
    5. Generate API key by visiting Veryfi (https://www.veryfi.com/receipt-ocr-api/)
    6. Add the keys to environment.
    7. Run the server: python3 app.py
    8. Open this link in browser: http://127.0.0.1:8000/
