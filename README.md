# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

### 1. Start the Database (MySQL)
Ensure your MySQL server is running (e.g., via XAMPP, Laragon, or your native MySQL installation) on the default port `3306`.
The application expects a database named `consultorio_dental`. You can import the database structure using the script located in:
`backend/db/init.sql`

### 2. Install dependencies
Install dependencies for both the root project (Expo) and the backend:
```bash
npm install
cd backend && npm install
```

### 3. Start the Backend Server
Run the backend server in a separate terminal. This will connect to the MySQL database:
```bash
npm run backend
```

### 4. Start the Expo App
Run the Expo development server in another terminal:
```bash
npm start
```
From here, you can open the app on your physical device using the Expo Go app by scanning the QR code, or open it in an Android/iOS emulator.

*Note: The API URL is dynamically configured to resolve your development machine's local IP address so it connects seamlessly when testing on physical devices.*

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
