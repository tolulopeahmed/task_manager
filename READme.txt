Follow these steps to set up and run the application locally.

Installation
Clone the Repository:

git clone https://github.com/tolulopeahmed/task_manager.git
cd task_manager
Install Dependencies:

pip install -r requirements.txt
Set Up Database:

python manage.py migrate
Usage
Run the Development Server:

python manage.py runserver
Access the Application:

Open your web browser and go to http://127.0.0.1:8000/ or http://localhost:8000 as the case may be to view the Task Manager Application.