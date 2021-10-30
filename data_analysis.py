import pandas as pd
import csv
from models import Expenditure, db


df = pd.read_csv("./static/data/expenditure.csv", quoting=csv.QUOTE_NONE)


def data_entry():
    for i in range(10000, 2000000, 10000):
        expenditure = Expenditure()
        new_df = df[(df['Total Household Income'] >= i) & (
            df['Total Household Income'] <= (i + 10000))]
        average = new_df.mean(axis=0)
        expenditure.count = len(new_df)
        expenditure.income = i + 10000
        expenditure.food = average['Total Food Expenditure']
        expenditure.green_grocery = average['Fruit Expenditure'] + \
            average['Vegetables Expenditure']
        expenditure.hotels = average['Restaurant and hotels Expenditure']
        expenditure.alcohol = average['Alcoholic Beverages Expenditure'] + \
            average['Tobacco Expenditure']
        expenditure.clothes = average['"Clothing'] + \
            average[' Footwear and Other Wear Expenditure"']
        expenditure.house = average['Housing and water Expenditure']
        expenditure.health = average['Medical Care Expenditure']
        expenditure.education = average['Education Expenditure']
        expenditure.special_occasion = average['Special Occasions Expenditure']
        db.session.add(expenditure)
        db.session.commit()

    expenditure = Expenditure()
    expenditure.income = 2010000
    expenditure.count = 127
    expenditure.food = 269894.7323
    expenditure.green_grocery = 11091.6063
    expenditure.hotels = 92954.80315
    expenditure.alcohol = 3006.5866
    expenditure.clothes = 209132.185
    expenditure.house = 380026.4882
    expenditure.health = 62743.3622
    expenditure.education = 76097.6614
    expenditure.special_occasion = 35365.622
    db.session.add(expenditure)
    db.session.commit()


def data_analysis(response, income, category, expense):
    if int(income) >= 2000000:
        new_income = 2010000
    else:
        mul = "0" * (len(income) - 1)
        new_mul = "1" + mul
        round_income = round(int(income) / int(new_mul)) * int(new_mul)
        new_income = int(round_income) + 10000
    
    data_set = Expenditure.query.filter_by(income=str(new_income)).first()

    sub_total = response['subtotal']
    tax_ = response['tax']
    total_ = response['total']
    payment_type = response['payment_type']
    currency_code = response['currency_code']
    date = response['date']
    new_expense = float(expense) + total_
    count = data_set.count

    if category == 'food':
        average_val = float(data_set.food)
        new_val = ((average_val * count) + total_) / (count + 1)
        data_set.food = str(new_val)
    elif category == 'green_grocery':
        average_val = float(data_set.green_grocery)
        new_val = ((average_val * count) + total_) / (count + 1)
        data_set.green_grocery = str(new_val)
    elif category == 'hotels':
        average_val = float(data_set.hotels)
        new_val = ((average_val * count) + total_) / (count + 1)
        data_set.hotels = str(new_val)
    elif category == 'alcohol':
        average_val = float(data_set.alcohol)
        new_val = ((average_val * count) + total_) / (count + 1)
        data_set.alcohol = str(new_val)
    elif category == 'clothes':
        average_val = float(data_set.clothes)
        new_val = ((average_val * count) + total_) / (count + 1)
        data_set.clothes = str(new_val)
    elif category == 'house':
        average_val = float(data_set.house)
        new_val = ((average_val * count) + total_) / (count + 1)
        data_set.house = str(new_val)
    elif category == 'health':
        average_val = float(data_set.health)
        new_val = ((average_val * count) + total_) / (count + 1)
        data_set.health = str(new_val)
    elif category == 'education':
        average_val = float(data_set.education)
        new_val = ((average_val * count) + total_) / (count + 1)
        data_set.education = str(new_val)
    elif category == 'special_occasion':
        average_val = float(data_set.special_occasion)
        new_val = ((average_val * count) + total_) / (count + 1)
        data_set.special_occasion = str(new_val)
    else:
        return {"category": "Invalid"}

    if (new_expense >= average_val):
        more_than_average = True
    else:
        more_than_average = False

    average_expense_diff = average_val - new_expense
    data_set.count += 1
    db.session.add(data_set)
    db.session.commit()

    items_bought = {}

    for item in response['line_items']:
        name = item['description']
        price = item['price']
        quantity = item['quantity']
        total = item['total']
        items_bought[item['order']] = {
            'name': name,
            'price': price,
            'quantity': quantity,
            'total': total
        }

    vendor_details = {
        'address': response["vendor"]["address"],
        'category': response["vendor"]["category"],
        'email': response["vendor"]["email"],
        'name': response["vendor"]["name"],
        'phone_number': response["vendor"]["phone_number"],
        'raw_name': response["vendor"]["raw_name"],
        'vendor_type': response["vendor"]["vendor_type"]
    }

    api_response = {
        "subtotal": sub_total,
        "total_tax": tax_,
        "total": total_,
        "payment_type": payment_type,
        "currency_code": currency_code,
        "date": date,
        "items_bought": items_bought,
        "vendor_details": vendor_details,
        "new_expense": new_expense,
        "more_than_average": more_than_average,
        "average_expense_diff": average_expense_diff
    }

    return api_response
