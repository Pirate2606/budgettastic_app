from models import db, app
from config import Config
from cli import create_db
from data_analysis import data_entry, data_analysis
from flask_restful import Api, Resource
from flask import request
from ocr import perform_ocr


app.config.from_object(Config)
app.cli.add_command(create_db)
db.init_app(app)
api = Api(app)


class Analysis(Resource):
    def get(self):
        url = request.args.get('url')
        category = request.args.get('cat')
        income = request.args.get('inc')
        expense = request.args.get('exp')
        response = perform_ocr(url, category)
        api_response = data_analysis(response, income, category, expense)
        return api_response


api.add_resource(Analysis, '/analysis')


if __name__ == '__main__':
    app.run(port=8000)
