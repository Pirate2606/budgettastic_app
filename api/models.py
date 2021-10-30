from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
db = SQLAlchemy()


class Expenditure(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    count = db.Column(db.Integer)
    income = db.Column(db.String(128))
    food = db.Column(db.String(128))
    green_grocery = db.Column(db.String(128))
    hotels = db.Column(db.String(128))
    alcohol = db.Column(db.String(128))
    clothes = db.Column(db.String(128))
    house = db.Column(db.String(128))
    health = db.Column(db.String(128))
    education = db.Column(db.String(128))
    special_occasion = db.Column(db.String(128))
