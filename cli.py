import click
from flask.cli import with_appcontext
from models import db
from data_analysis import data_entry


@click.command(name="createdb")
@with_appcontext
def create_db():
    db.create_all()
    db.session.commit()
    print("Database tables created")
    data_entry()
    print("Data Entered Successfully")
