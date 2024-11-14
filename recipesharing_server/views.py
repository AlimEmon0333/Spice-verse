import json
import base64
from bson import ObjectId  ## pylint: disable=import-error
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import (
    users_collection,
    User,
    recipes_collection,
    Recipe,
    shoppings_collection,
    ShoppingList,
    comments_collection,
    Comment,
    ratings_collection,
    Rating,
)


@csrf_exempt
def Signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            if not username:
                return JsonResponse({"error": "Username are required"}, status=400)
            if not email:
                return JsonResponse({"error": "Email are required"}, status=400)
            if not password:
                return JsonResponse({"error": "Password are required"}, status=400)
            if users_collection.find_one({"username": username}):
                return JsonResponse({"error": "Username already exists"}, status=400)
            if users_collection.find_one({"email": email}):
                return JsonResponse({"error": "Email already exists"}, status=400)
            if len(password) < 8:
                return JsonResponse(
                    {"error": "Password must be at least 8 characters"}, status=400
                )
            new_user = User(username=username, email=email, password=password)
            users_collection.insert_one(new_user.__dict__)
            response_data = {
                "message": "User created successfully",
                "user": {
                    "id": str(new_user._id),  ## pylint: disable=no-member
                    "username": new_user.username,
                    "email": new_user.email,
                    "created_at": new_user.created_at,
                    "updated_at": new_user.updated_at,
                },
            }
            return JsonResponse(response_data, status=201)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>")


@csrf_exempt
def Login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            if not username or not password:
                return JsonResponse({"error": "Username and password must be required"})
            if username:
                user = users_collection.find_one({"username": username})
                if not user:
                    return JsonResponse({"error": "Invalid username"}, status=401)
            if password:
                if user["password"] != password:
                    return JsonResponse({"error": "Invalid password"}, status=401)

            response_data = {
                "message": "Login Successful",
                "user": {
                    "id": str(user["_id"]),  # Convert ObjectId to string
                    "email": user["email"],
                    "username": user["username"],
                },
            }
            return JsonResponse({"user": response_data}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>")


def GetUser(request, userId):
    if request.method == "GET":
        try:
            try:
                user_id = ObjectId(userId)
            except Exception as e:
                return JsonResponse({"error": "Invalid user ID format"}, status=400)
            user = users_collection.find_one({"_id": user_id})
            if user:
                response_data = {
                    "id": str(
                        user["_id"]
                    ),  # Convert ObjectId to string for proper JSON serialization
                    "username": user["username"],
                    "email": user["email"],
                    "created_at": user.get("created_at", "N/A"),
                    "updated_at": user.get("updated_at", "N/A"),
                }
                return JsonResponse({"user": response_data}, status=200)
            else:
                return JsonResponse({"message": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>")


@csrf_exempt
def AddRecipe(request):
    if request.method == "POST":
        try:
            userId = request.POST.get("userId")
            recipeImage = request.FILES.get("recipeImage")
            recipeName = request.POST.get("recipeName")
            description = request.POST.get("description")
            ingredients = request.POST.get("ingredients")
            instructions = request.POST.get("instructions")
            if (
                not userId
                or not recipeImage
                or not recipeName
                or not description
                or not ingredients
                or not instructions
            ):
                return JsonResponse(
                    {"error": "All fields must be required"}, status=400
                )
            recipeImageBinary = recipeImage.read()
            recipe = Recipe(
                userId=userId,
                recipeImage=recipeImageBinary,
                recipeName=recipeName,
                description=description,
                ingredients=ingredients,
                instructions=instructions,
            )
            recipe_save = recipes_collection.insert_one(recipe.__dict__)
            recipe_id = recipe_save.inserted_id
            users_collection.update_one(
                {"_id": ObjectId(userId)}, {"$push": {"recipes": recipe_id}}
            )
            response_Data = {
                "message": "Recipe added successfully",
                "recipe": {"id": str(recipe_id), "recipeName": recipe.recipeName},
            }
            return JsonResponse(response_Data, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>")


@csrf_exempt
def GetRecipeById(request, recipeId):
    if request.method == "GET":
        try:
            # Check if recipeId is valid
            if not ObjectId.is_valid(recipeId):
                return JsonResponse({"error": "Invalid recipe ID"}, status=400)

            # Find the recipe by ID
            recipe = recipes_collection.find_one({"_id": ObjectId(recipeId)})

            # Check if the recipe was found
            if not recipe:
                return JsonResponse({"error": "Recipe not found"}, status=404)

            # Fetch Ratings and Comments details (not just IDs)
            ratings = ratings_collection.find(
                {"_id": {"$in": recipe.get("ratings", [])}}
            )
            comments = comments_collection.find(
                {"_id": {"$in": recipe.get("comments", [])}}
            )

            ratings_list = [
                {
                    "id": str(rating["_id"]),
                    "rating": (
                        rating.get("rate") if rating.get("rate") else "No rating"
                    ),
                }
                for rating in ratings
            ]

            comments_list = [
                {
                    "id": str(comment["_id"]),
                    "comment": comment.get("comment", "No comment"),
                }
                for comment in comments
            ]

            # Encode recipe image to Base64 if available
            recipe_image_base64 = None
            if recipe.get("recipeImage"):
                recipe_image_base64 = base64.b64encode(recipe["recipeImage"]).decode(
                    "utf-8"
                )

            # Prepare the recipe data for response
            recipe_data = {
                "id": str(recipe["_id"]),
                "userId": recipe["userId"],
                "recipeName": recipe["recipeName"],
                "description": recipe["description"],
                "ingredients": recipe["ingredients"],
                "instructions": recipe["instructions"],
                "recipeImage": recipe_image_base64,  # Now in Base64 format
                "ratings": ratings_list,  # Array of actual Ratings data
                "comments": comments_list,  # Array of actual Comments data
            }

            return JsonResponse({"recipe": recipe_data}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>")


@csrf_exempt
def get_all_recipes(request):
    if request.method == "GET":
        try:
            recipes = list(recipes_collection.find())
            recipes_data = []
            for recipe in recipes:
                # Fetch Ratings and Comments details (not just IDs)
                ratings = ratings_collection.find(
                    {"_id": {"$in": recipe.get("ratings", [])}}
                )
                comments = comments_collection.find(
                    {"_id": {"$in": recipe.get("comments", [])}}
                )

                # Convert the ratings and comments to lists of dictionaries
                ratings_list = [
                    {
                        "id": str(rating["_id"]),
                        "rating": (
                            rating.get("rate")
                            if rating.get("rate")
                            else "No rating"
                        ),
                    }
                    for rating in ratings
                ]

                comments_list = [
                    {
                        "id": str(comment["_id"]),
                        "comment": comment.get("comment", "No comment"),
                    }
                    for comment in comments
                ]

                # Encode recipe image to Base64 if available
                recipe_image_base64 = None
                if recipe.get("recipeImage"):
                    recipe_image_base64 = base64.b64encode(
                        recipe["recipeImage"]
                    ).decode("utf-8")

                # Prepare the recipe data for response
                recipes_data.append(
                    {
                        "id": str(recipe["_id"]),
                        "userId": recipe["userId"],
                        "recipeName": recipe["recipeName"],
                        "description": recipe["description"],
                        "ingredients": recipe["ingredients"],
                        "instructions": recipe["instructions"],
                        "recipeImage": recipe_image_base64,  # Now in Base64 format
                        "ratings": ratings_list,  # Actual Ratings data
                        "comments": comments_list,  # Actual Comments data
                    }
                )
            return JsonResponse({"recipes": recipes_data}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>")


def get_user_recipes(request, userId):
    if request.method == "GET":
        if not userId:
            return JsonResponse({"error": "userId is required"}, status=400)
        try:
            # Fetch recipes by userId
            user_recipes = list(recipes_collection.find({"userId": userId}))

            # Fetch Ratings and Comments details (not just IDs)
            recipes_data = []
            for recipe in user_recipes:
                ratings = ratings_collection.find(
                    {"_id": {"$in": recipe.get("ratings", [])}}
                )
                comments = comments_collection.find(
                    {"_id": {"$in": recipe.get("comments", [])}}
                )

                # Convert the ratings and comments to lists of dictionaries
                ratings_list = [
                    {
                        "id": str(rating["_id"]),
                        "rating": (
                            rating.get("rate")
                            if rating.get("rate")
                            else "No rating"
                        ),
                    }
                    for rating in ratings
                ]

                comments_list = [
                    {"id": str(comment["_id"]), "comment": comment["comment"]}
                    for comment in comments
                ]

                # Encode recipe image to Base64 if available
                recipe_image_base64 = None
                if recipe.get("recipeImage"):
                    recipe_image_base64 = base64.b64encode(
                        recipe["recipeImage"]
                    ).decode("utf-8")

                # Prepare the recipe data for response
                recipes_data.append(
                    {
                        "id": str(recipe["_id"]),
                        "userId": recipe["userId"],
                        "recipeName": recipe["recipeName"],
                        "description": recipe["description"],
                        "ingredients": recipe["ingredients"],
                        "instructions": recipe["instructions"],
                        "recipeImage": recipe_image_base64,  # In Base64 format
                        "ratings": ratings_list,  # Actual Ratings data
                        "comments": comments_list,  # Actual Comments data
                    }
                )

            return JsonResponse({"recipes": recipes_data}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>")


@csrf_exempt
def DeleteRecipe(request, recipeId):
    if request.method == "DELETE":
        try:
            # Convert recipeId to ObjectId
            recipe_id = ObjectId(recipeId)

            # Find the recipe by ID
            recipe = recipes_collection.find_one({"_id": recipe_id})

            # Check if recipe exists
            if not recipe:
                return JsonResponse({"error": "Recipe not found"}, status=404)

            # Get the userId associated with the recipe
            userId = recipe["userId"]

            # Delete the recipe
            delete_recipe = recipes_collection.delete_one({"_id": recipe_id})

            # Check if deletion was successful
            if delete_recipe.deleted_count == 0:
                return JsonResponse({"error": "Failed to delete recipe"}, status=404)

            # Update the user's recipes list by removing the recipe ID
            users_collection.update_one(
                {"_id": ObjectId(userId)}, {"$pull": {"recipes": recipe_id}}
            )

            # Return success response
            return JsonResponse({"message": "Recipe Deleted Successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>")


@csrf_exempt
def AddShoppingList(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            userId = data.get("userId")
            listname = data.get("listname")
            items = data.get("items")

            # Validate required fields
            if not userId or not listname or not items:
                return JsonResponse({"error": "Missing required fields"}, status=400)
            if not isinstance(items, list) or not all(
                isinstance(item, dict) for item in items
            ):
                return JsonResponse(
                    {"error": "Items must be a list of dictionaries"}, status=400
                )

            # Prepare new shopping list document
            new_shopping_list = {
                "userId": ObjectId(userId),
                "listname": listname,
                "items": items,
            }

            # Insert into shoppings_collection and get the ID
            inserted_list = shoppings_collection.insert_one(new_shopping_list)
            list_id = inserted_list.inserted_id

            # Update user's shoppingLists array in users_collection
            users_collection.update_one(
                {"_id": ObjectId(userId)}, {"$push": {"shoppingLists": list_id}}
            )

            # Return success response
            return JsonResponse(
                {
                    "message": "Shopping list added successfully",
                    "shoppingListId": str(list_id),
                },
                status=200,
            )

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>", status=405)


def GetUserShoppingList(request, userId):
    if request.method == "GET":
        try:
            # Validate userId and retrieve shopping lists
            userId = ObjectId(userId)
            shopping_lists = shoppings_collection.find({"userId": userId})
            shopping_lists = list(shopping_lists)  # Convert cursor to list

            # Check if any shopping lists are found
            if not shopping_lists:
                return JsonResponse(
                    {"error": "No shopping lists found for this user"}, status=404
                )

            # Convert ObjectId fields to strings for JSON serialization
            for shopping_list in shopping_lists:
                shopping_list["_id"] = str(shopping_list["_id"])
                shopping_list["userId"] = str(shopping_list["userId"])

            # Return the shopping lists in JSON format
            return JsonResponse({"shoppingLists": shopping_lists}, status=200)

        except Exception as e:
            return JsonResponse(
                {"error": f"Invalid userId or database error: {str(e)}"}, status=400
            )
    else:
        return HttpResponse("<p>Invalid request method</p>", status=405)


@csrf_exempt
def DeleteShoppingList(request, shoppingListId):
    if request.method == "DELETE":
        try:
            shoppinglist_id = ObjectId(shoppingListId)
            list = shoppings_collection.find_one({"_id": shoppinglist_id})
            if not list:
                return JsonResponse({"error": "List not found"}, status=404)
            userId = list["userId"]
            delete_list = shoppings_collection.delete_one({"_id": shoppinglist_id})
            if delete_list.deleted_count == 0:
                return JsonResponse({"error": "Failed to delete List"}, status=404)
            users_collection.update_one(
                {"_id": ObjectId(userId)}, {"$pull": {"shoppingLists": shoppinglist_id}}
            )
            return JsonResponse({"message": "List Deleted Successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>")


@csrf_exempt
def AddComment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            recipeId = data.get("recipeId")
            comment_text = data.get("comment")
            if not recipeId or not comment_text:
                return JsonResponse({"error": "All fields required"}, status=400)
            recipe_object_id = ObjectId(recipeId)
            new_comment = {"recipeId": recipe_object_id, "comment": comment_text}
            comment_save = comments_collection.insert_one(new_comment)
            comment_id = comment_save.inserted_id
            recipes_collection.update_one(
                {"_id": recipe_object_id}, {"$push": {"comments": comment_id}}
            )
            return JsonResponse(
                {
                    "message": "Comment added successfully",
                    "comment": {
                        "id": str(comment_id),
                        "comment": comment_text,
                    },
                },
                status=200,
            )
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>", status=405)


@csrf_exempt
def DeleteComment(request, commentId):
    if request.method == "DELETE":
        try:
            comment_id = ObjectId(commentId)
            comment = comments_collection.find_one({"_id": comment_id})
            if not comment:
                return JsonResponse({"error": "Comment not found"}, status=404)
            recipeId = comment["recipeId"]
            delete_comment = comments_collection.delete_one({"_id": comment_id})
            if delete_comment.deleted_count == 0:
                return JsonResponse({"error": "Failed to delete comment"}, status=404)
            recipes_collection.update_one(
                {"_id": ObjectId(recipeId)}, {"$pull": {"comments": comment_id}}
            )
            return JsonResponse({"message": "Comment deleted successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>", status=405)


@csrf_exempt
def AddRate(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            recipeId = data.get("recipeId")
            rate = data.get("rate")
            if not recipeId or not rate:
                return JsonResponse({"error": "All fields required"}, status=400)
            recipe_object_id = ObjectId(recipeId)
            new_rate = {"recipeId": recipe_object_id, "rate": rate}
            rate_save = ratings_collection.insert_one(new_rate)
            rate_id = rate_save.inserted_id
            recipes_collection.update_one(
                {"_id": recipe_object_id}, {"$push": {"ratings": rate_id}}
            )
            return JsonResponse(
                {
                    "message": "Rate added successfully",
                    "rate": {
                        "id": str(rate_id),
                        "rate": rate,
                    },
                },
                status=200,
            )
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>", status=405)


@csrf_exempt
def DeleteRate(request, rateId):
    if request.method == "DELETE":
        try:
            rate_id = ObjectId(rateId)
            rate = ratings_collection.find_one({"_id": rate_id})
            if not rate:
                return JsonResponse({"error": "Rate not found"}, status=404)
            recipeId = rate["recipeId"]
            delete_rate = ratings_collection.delete_one({"_id": rate_id})
            if delete_rate.deleted_count == 0:
                return JsonResponse({"error": "Failed to delete rate"}, status=404)
            recipes_collection.update_one(
                {"_id": ObjectId(recipeId)}, {"$pull": {"ratings": rate_id}}
            )
            return JsonResponse({"message": "Rate deleted successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return HttpResponse("<p>Invalid request method</p>", status=405)
