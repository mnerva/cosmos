# Cosmos Odyssey

Cosmos Odyssey is a full-stack web application that shows the best deals for our demanding customers in our solar system. Customers must be able to select travel between the different planets and the system should show possible route-based prices. After careful consideration, the customer can choose to make a reservation to their name on a specific route.

## Features

- Filter and sort interplanetary flight offers
- Add flight deals to a cart and view a summary
- Make reservations with a unique reservation code
- View reservation details using your code and name
- Data synced from an external API every 5 minutes

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, MySQL, dotenv
- **Other:** node-cron (for scheduled data sync), ESLint

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL server

### Setup

1. **Clone the repository:**
   ```sh
   git clone <https://github.com/mnerva/cosmos.git>
2. **Install dependencies**
  npm install
3. **Create a .env file**
  Fill in your MySQL credentials (at least password)
  - DB_HOST=localhost
  - DB_USER=root
  - DB_PASSWORD=yourpasssword
  - DB_NAME=cosmos
  - PORT=5050

4. **To start**<br>

    **For backend**
  - cd api
  - node server.js

    **For frontend**

  - /cosmos
  - npm run dev

5. **Open your app:**
  Visit the app: http://localhost:5173 in your browser