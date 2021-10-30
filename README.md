# Budgettastic API

## Endpoints

    https://budgettastic-api.herokuapp.com/analysis?url=<IMAGE_URL>&cat=<CATEGORY>&inc=<INCOME>&exp=<CURRENT_EXPENSES>
    Example URL: https://budgettastic-api.herokuapp.com/analysis?url=https://i.ibb.co/CQ0th2r/test1.jpg&cat=food&inc=20000&exp=450

### Parameters to be passed in the URL:

    IMAGE_URL: Downloadable image URL. eg: https://i.ibb.co/CQ0th2r/test1.jpg
    CATEGORY can be any one of these: ['food', 'green_grocery', 'hotels', 'alcohol', 'clothes', 'house', 'health', 'education', 'special_occasion']
    INCOME >= 10000
    EXPENSES: Total expenses of the family for a particular category.

## Output

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

## Run the project locally:

### Prerequisites:

    1. Python3 should be installed on the system.
    2. Need an active internet connection.

### Steps:

    1. Setup a virtual environment:
        For ubuntu:
            1. sudo apt install virtualenv
            2. virtualenv -p python3 name_of_environment
            3. To activate: source name_of_environment/bin/activate
        For windows:
            1.	pip install virtualenv
            2.	python -m venv <path for creating virtualenv>
            3.	To activate: <virtualenv path>\Scripts\activate

    2. Clone the repository: git clone https://github.com/Pirate2606/budgettastic_api
    3. Change the directory: cd budgettastic_api
    4. Install the requirements: pip install -r requirements.txt
    5. Generate API key by visiting Veryfi (https://www.veryfi.com/receipt-ocr-api/)
    6. Add the keys to environment.
    7. Run the server: python3 app.py
    8. Open this link in browser: http://127.0.0.1:8000/
