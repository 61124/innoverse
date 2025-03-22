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
                        "profileCompleted": user_profile.profile_completed
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