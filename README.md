# Sathyabama Canteen Portal (Sathypay)

Welcome to **Sathypay**, a Smart Payment Solution for the Sathyabama University Canteen. This system enables a seamless digital ordering process, complete with real-time updates, secure transactions, and advanced admin functionalities. The portal aims to enhance both customer and admin experiences while maintaining a production-ready architecture.

---

## Project Demo

https://github.com/user-attachments/assets/5509328b-3ebd-4c0e-bcf8-3ee521a6fa50

---

## Features

### 1. **Dynamic QR Code Order Management**
- Generates unique QR codes after successful payment.
- Simplifies order validation and expiration through admin scanning.

### 2. **Real-Time Order Status Updates**
- Empowers admins with instant access to ongoing orders.
- Enhances operational efficiency and customer satisfaction.

### 3. **Robust Secure Payment Handling**
- Ensures secure transactions using Stripe API.
- Employs advanced authentication protocols to protect user data.

### 4. **Scalable Architecture**
- Built with Appwrite for flexible and efficient data management.
- Designed to accommodate increasing user demand effortlessly.

### 5. **Comprehensive Admin Dashboard**
- Manage food availability dynamically.
- Access transaction summaries and detailed logs for streamlined operations.

### 6. **Responsive Design**
- User-friendly interface designed with Tailwind CSS.
- Fully mobile-responsive for optimal usability on any device.

---

## Tech Stack

- **Frontend**: React, Next.js, TypeScript
- **Backend**: Appwrite, MongoDB
- **Payment Integration**: Stripe API
- **Styling**: Tailwind CSS

---

## Installation and Setup

Follow these steps to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akshayyy22/Sathyabama-Canteen.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd Sathyabama-Canteen
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the required keys for Appwrite and Stripe integration.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### For Customers:
1. Browse the menu and add items to the cart.
2. Proceed to payment via the secure Stripe gateway.
3. Receive a unique QR code for your order.

### For Admins:
1. Access the admin dashboard to manage food availability.
2. View ongoing orders with real-time updates.
3. Scan QR codes to validate and expire orders efficiently.

---

## Roadmap

- Add multi-language support.
- Introduce AI-powered order recommendations.
- Enhance analytics and reporting features.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for feedback and suggestions.

---

## Contact

For any inquiries, please contact [akshaypersonalstudentid@gmail.com](mailto:akshaypersonalstudentid@gmail.com).
