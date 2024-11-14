from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.Signup, name="signup"),
    path("login/", views.Login, name="login"),
    path("user/<userId>", views.GetUser, name="User"),
    path("recipe/", views.AddRecipe, name="recipe"),
    path("getRecipeById/<recipeId>", views.GetRecipeById, name="recipebyid"),
    path("getAllRecipes/", views.get_all_recipes, name="getAllRecipes"),
    path("getUserRecipes/<userId>", views.get_user_recipes, name="getUserRecipes"),
    path("deleteRecipe/<recipeId>", views.DeleteRecipe, name="deleteRecipe"),
    path("addShoppingList/", views.AddShoppingList, name="addShoppingList"),
    path(   
        "getShoppingList/<userId>",
        views.GetUserShoppingList,
        name="GetUserShoppingList",
    ),
    path(
        "deleteShoppingList/<shoppingListId>",
        views.DeleteShoppingList,
        name="deleteShoppingList",
    ),
    path(
        "addComment/",
        views.AddComment,
        name="addComment",
    ),
    path(
        "deleteComment/<commentId>",
        views.DeleteComment,
        name="addComment",
    ),
    path(
        "addRate/",
        views.AddRate,
        name="addRate",
    ),
    path(
        "deleteRate/<rateId>",
        views.DeleteRate,
        name="addRate",
    ),
]
