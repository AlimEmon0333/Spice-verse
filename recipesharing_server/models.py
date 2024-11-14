from django.db import models
from datetime import datetime

from db_connection import db

users_collection = db["users"]
recipes_collection = db["recipes"]
shoppings_collection = db["shoppinglists"]
comments_collection = db["comments"]
ratings_collection = db["ratings"]


class User(models.Model):
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password
        self.recipes = []
        self.shoppingLists = []
        self.created_at = datetime.now()  ## pylint: disable=no-member
        self.updated_at = datetime.now()  ## pylint: disable=no-member


class Recipe(models.Model):
    def __init__(
        self, userId, recipeImage, recipeName, description, ingredients, instructions
    ):
        self.userId = userId
        self.recipeImage = recipeImage
        self.recipeName = recipeName
        self.description = description
        self.ingredients = ingredients
        self.instructions = instructions
        self.comments = []
        self.ratings = []
        self.created_at = datetime.now()  ## pylint: disable=no-member
        self.updated_at = datetime.now()  ## pylint: disable=no-member


class ShoppingList:
    def __init__(self, listname, items=None):
        self.listname = listname
        self.items = items if items is not None else []
        self.created_at = datetime.now()  ## pylint: disable=no-member
        self.updated_at = datetime.now()  ## pylint: disable=no-member


class Comment:
    def __init__(self, comment, recipeId):
        self.recipeId = recipeId
        self.comment = comment
        self.created_at = datetime.now()  ## pylint: disable=no-member
        self.updated_at = datetime.now()  ## pylint: disable=no-member


class Rating:
    def __init__(self, rate, recipeId):
        self.recipeId = recipeId
        self.rate = rate
        self.created_at = datetime.now()  ## pylint: disable=no-member
        self.updated_at = datetime.now()  ## pylint: disable=no-member
