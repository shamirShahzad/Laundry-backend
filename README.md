# Project Setup Instructions

Follow these steps to set up and run the project locally:

1. **Clone the Repository**

   Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/shamirShahzad/Laundry-backend.git
   ```

2. **Install NodeJS**

    Install nodeJs v22.13.0 on your computer:<https://nodejs.org/en/download>:
    visit the given link to download for your appropriate operating system.

3. **Navigate to the Project Directory**

   Change your current working directory to the project folder:

   ```bash
   cd <project-directory>
   ```

   Replace `<project-directory>` with the name of the directory where the project was cloned.

4. **Install Dependencies**

   Install the project dependencies using npm:

   ```bash
   npm install
   ```

5. **Install PostgreSQL v17 on your system**

    Make Sure that before you begin you have installed postgreSQL v17 on your system as we need it for our database.
    <https://www.postgresql.org/download/> visit this link and choose your appropriate operating system and download postgreSQL by following the guidelines in the documentation

6. **Set Up Environment Variables**

   Create a `.env` file in the root of the project and set up the necessary environment variables. Refer to `.env.example` if available for guidance on required variables. Add PORT,DATABASE,DATABASE_PORT,DATABASE_USER,DATABASE_HOST,DATABASE_PASSWORD and fill those values with the appropriate data.

7. **Run Database Migrations**

   Execute the database migrations to set up the necessary tables:

   ```bash
   npm run migrate
   ```

8. **Start the Development Server**

   Start the development server using the following command:

   ```bash
   npm run dev
   ```

   The server should now be running on `http://localhost:3000` or the port specified in the `.env` file.

9. **Access the Application**

   Open a web browser and navigate to `http://localhost:3000` to access the application.

Now your project should be up and running locally!
