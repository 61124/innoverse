from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from profiles.models import UserProfile
import json

# Test API
def test_api(request):
    return JsonResponse({"message": "Hello from Django!"})

from django.core.files.base import ContentFile
import base64

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import psycopg2
from sklearn.model_selection import train_test_split

def calculate_performance_score(result, timeSpent, revisitCount, dataset):
    """
    Calculate performance score based on result, time spent, and revisit count
    """
    # Calculate difficulty factor
    difficulty_factor = np.log1p(revisitCount + timeSpent)
    
    # Calculate performance score using the same formula as in the dataset
    performance_score = (
        0.4 * np.tanh(result / 100) +                  
        0.4 * np.tanh(result / difficulty_factor) +    
        0.1 * (result / (timeSpent + 1)) +             
        0.1 * np.exp(-revisitCount / 3)                    
    )
    
    return performance_score

@csrf_exempt
def predict_improvement(request):
    if request.method == 'POST':
        try:
            # Generate sample data instead of fetching from DB
            test_sample = pd.DataFrame([{
                'result': 90,  # Example score
                'timeSpent': 60,  # Example time in minutes
                'revisitCount': 1  # Example revisit count
            }])

            # Generate training data
            np.random.seed(42)
            num_rows = 1500
            df = pd.DataFrame({
                "result": np.random.randint(0, 101, num_rows),  
                "timeSpent": np.random.randint(30, 301, num_rows),
                "revisitCount": np.random.randint(1, 7, num_rows)
            })

            # Calculate difficulty factor
            df["difficulty_factor"] = np.log1p(df["revisitCount"] + df["timeSpent"])
            
            # Calculate performance score
            df["performanceScore"] = (
                0.4 * np.tanh(df["result"] / 100) +                  
                0.4 * np.tanh(df["result"] / df["difficulty_factor"]) +    
                0.1 * (df["result"] / (df["timeSpent"] + 1)) +             
                0.1 * np.exp(-df["revisitCount"] / 3)                    
            )
            
            threshold = np.percentile(df["performanceScore"], 35)
            df["label"] = np.where(df["performanceScore"] < threshold, 1, 0)

            # Prepare features
            X = df[["result", "timeSpent", "revisitCount"]]
            y = df["label"]

            # Train model
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            
            logistic_model = LogisticRegression()
            logistic_model.fit(X_train_scaled, y_train)

            # Make prediction
            test_scaled = scaler.transform(test_sample)
            prediction = logistic_model.predict(test_scaled)[0]

            # Calculate performance score for the test sample
            performance_score = calculate_performance_score(
                result=test_sample['result'].iloc[0],
                timeSpent=test_sample['timeSpent'].iloc[0],
                revisitCount=test_sample['revisitCount'].iloc[0],
                dataset=df
            )

            response_data = {
                'needForImprovement': int(prediction),
                'performanceScore': float(performance_score)
            }

            return JsonResponse(response_data)
            
        except Exception as e:
            print(f"Error in predict_improvement: {str(e)}")  # Add this line for debugging
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({"status": "error", "message": "Email and password are required."})

            # Try to find the user by email first
            try:
                user_obj = User.objects.get(email=email)
                # Now authenticate with username and password
                user = authenticate(username=user_obj.username, password=password)
                
                if user is not None:
                    # Log the user in (creates session)
                    login(request, user)
                    
                    # Get or create profile
                    user_profile, created = UserProfile.objects.get_or_create(user=user)
                    
                    return JsonResponse({
                        "status": "success",
                        "message": "Login successful!",
                        "profileCompleted": user_profile.profile_completed,
                        "name": user.first_name  # Add this line to return the name
                    })
                else:
                    return JsonResponse({"status": "error", "message": "Invalid password."})
            except User.DoesNotExist:
                return JsonResponse({"status": "error", "message": "No account found with this email."})

        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON data."})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})

    return JsonResponse({"status": "error", "message": "Invalid request method."})

# Profile setup with improved file handling
@csrf_exempt
def profile_setup(request):
    if request.method == 'POST':
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({"status": "error", "message": "Authentication required."})
            
        try:
            # Handle multipart form data
            if request.content_type and 'multipart/form-data' in request.content_type:
                # Get or create user profile
                user_profile, created = UserProfile.objects.get_or_create(user=request.user)
                
                # Update fields from POST data
                if 'name' in request.POST:
                    request.user.first_name = request.POST.get('name')
                    request.user.save()
                    
                if 'age' in request.POST:
                    user_profile.age = request.POST.get('age')
                    
                if 'city' in request.POST:
                    user_profile.city = request.POST.get('city')
                    
                if 'educationLevel' in request.POST:
                    user_profile.education_level = request.POST.get('educationLevel')
                    
                if 'educationDetails' in request.POST:
                    user_profile.education_details = request.POST.get('educationDetails')
                
                # Handle profile picture
                if 'profilePicture' in request.FILES:
                    user_profile.profile_picture = request.FILES['profilePicture']
                
                # Mark profile as completed
                user_profile.profile_completed = True
                user_profile.save()
            
            # Handle JSON data
            else:
                data = json.loads(request.body)
                
                # Get or create user profile
                user_profile, created = UserProfile.objects.get_or_create(user=request.user)
                
                # Update user name if provided
                if 'name' in data:
                    request.user.first_name = data.get('name')
                    request.user.save()
                
                # Update profile fields
                user_profile.age = data.get('age', user_profile.age)
                user_profile.city = data.get('city', user_profile.city)
                user_profile.education_level = data.get('educationLevel', user_profile.education_level)
                user_profile.education_details = data.get('educationDetails', user_profile.education_details)
                
                # Mark profile as completed
                user_profile.profile_completed = True
                user_profile.save()
            
            return JsonResponse({
                "status": "success", 
                "message": "Profile updated successfully!"
            })
            
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    
    return JsonResponse({"status": "error", "message": "Invalid request method."})

# Add a check_auth endpoint
@csrf_exempt
def check_auth(request):
    if request.user.is_authenticated:
        try:
            # Get or create profile
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            
            return JsonResponse({
                "authenticated": True,
                "email": request.user.email,
                "name": request.user.first_name,
                "profileCompleted": profile.profile_completed
            })
        except Exception as e:
            return JsonResponse({
                "authenticated": True,
                "email": request.user.email,
                "error": str(e)
            })
    else:
        return JsonResponse({"authenticated": False})

# Improved logout
@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        # This will remove the session
        logout(request)
        return JsonResponse({
            "status": "success", 
            "message": "Logout successful!"
        })
    return JsonResponse({"status": "error", "message": "Invalid request method."})
    
@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not email or not password or not name:
            return JsonResponse({"status": "error", "message": "Name, email, and password are required."})

        if User.objects.filter(email=email).exists():
            return JsonResponse({"status": "error", "message": "User already exists."})

        # Create user and profile
        user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
        UserProfile.objects.create(user=user)
        return JsonResponse({"status": "success", "message": f"User {email} registered!"})

    return JsonResponse({"status": "error", "message": "Invalid request method."})
