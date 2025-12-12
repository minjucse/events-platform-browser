# EventHub Management System

A comprehensive event management platform that connects people through local events, activities, and experiences. Built with modern web technologies and featuring role-based access control for seamless event organization and participation.

## 🌐 Live Demo

**Frontend:** [https://event-hub-management.vercel.app](https://event-hub-management.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles & Permissions](#user-roles--permissions)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Payment Integration](#payment-integration)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication & Authorization
- Cookie-based authentication system
- Role-based access control (USER, HOST, ADMIN)
- Email verification with OTP
- Password reset functionality
- Secure user registration and login

### 👤 User Management
- Complete user profile management
- Profile photo upload with Cloudinary integration
- Public profile viewing
- User status management (Active/Blocked)

### 🎯 Event Management
- Create, read, update, and delete events
- Event categorization and filtering
- Image upload for events
- Event status management (Pending, Ongoing, Completed, Cancelled)
- Real-time participant tracking
- Location-based event discovery

### 💳 Payment System
- Stripe payment integration
- Secure payment processing for paid events
- Payment verification and tracking
- Revenue dashboard for admins
- Free and paid event support

### ⭐ Review System
- Event and host review functionality
- Rating system (1-5 stars)
- Review management and moderation
- Host review statistics

### 💝 Favorites System
- Save favorite events
- Personal event collections
- Easy access to saved events

### 📊 Dashboard Features

#### USER Dashboard
- Personal event statistics
- Participated events overview
- Upcoming events display
- Saved events management
- Review history
- Monthly activity tracking

#### HOST Dashboard
- Event creation and management
- Participant tracking
- Revenue analytics
- Host review management
- Event performance metrics
- Host application system

#### ADMIN Dashboard
- User management and moderation
- Event approval and management
- Host application reviews
- Platform analytics
- Revenue tracking
- Review moderation
- System-wide statistics

### 🎨 UI/UX Features
- Responsive design for all devices
- Dark/Light theme toggle
- Modern glassmorphism design
- Smooth animations and transitions
- Intuitive navigation
- Real-time notifications

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Context API
- **Forms:** React Hook Form
- **Notifications:** Sonner
- **Theme:** next-themes
- **Payment:** Stripe React

### Backend Integration
- **API:** RESTful API with cookie-based authentication
- **File Upload:** Cloudinary integration
- **Payment Processing:** Stripe
- **Real-time Updates:** Server-sent events

### Development Tools
- **Package Manager:** npm/yarn
- **Linting:** ESLint
- **Formatting:** Prettier
- **Version Control:** Git
- **Deployment:** Vercel

## 👥 User Roles & Permissions

### 🟢 USER Role
- Browse and search events
- Join events (free and paid)
- Manage personal profile
- Save favorite events
- Write reviews for attended events
- View participation history
- Apply to become a host

### 🔵 HOST Role
- All USER permissions
- Create and manage events
- Track event participants
- View revenue analytics
- Manage host reviews
- Access host dashboard
- Event performance insights

### 🔴 ADMIN Role
- All HOST permissions
- Manage all users and hosts
- Approve/reject events
- Review host applications
- Access platform analytics
- Moderate reviews
- Manage system settings
- Revenue oversight

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rokon-Khan/events-management-frontend.git
   cd events-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables (see [Environment Variables](#environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Folder Structure

```
event-management-frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Dashboard pages
│   │   └── dashboard/
│   │       ├── users/            # Admin user management
│   │       ├── hosts/            # Admin host management
│   │       ├── events/           # Event management
│   │       ├── reviews/          # Review management
│   │       ├── revenue/          # Revenue dashboard
│   │       ├── my-events/        # User's events
│   │       ├── upcoming/         # Upcoming events
│   │       ├── saved/            # Saved events
│   │       └── become-hosts/     # Host applications
│   ├── (main)/                   # Public pages
│   │   ├── events/               # Event listing and details
│   │   ├── profile/              # User profiles
│   │   └── become-host/          # Host application
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # Reusable components
│   ├── ui/                       # Shadcn/ui components
│   ├── dashboard/                # Dashboard-specific components
│   ├── auth/                     # Authentication components
│   ├── event-card.tsx            # Event display component
│   ├── review-form.tsx           # Review submission
│   ├── stripe-payment.tsx        # Payment component
│   └── theme-toggle.tsx          # Theme switcher
├── lib/                          # Utility libraries
│   ├── api/                      # API service functions
│   ├── auth-context.tsx          # Authentication context
│   ├── types.ts                  # TypeScript definitions
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
└── README.md                     # Project documentation
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=your_backend_api_url

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🔌 API Integration

The frontend integrates with a RESTful API backend featuring:

- **Authentication:** Cookie-based sessions
- **File Upload:** Cloudinary integration
- **Payment Processing:** Stripe webhooks
- **Real-time Updates:** Server-sent events
- **Data Validation:** Comprehensive input validation
- **Error Handling:** Structured error responses

### Key API Endpoints
- `/auth/*` - Authentication routes
- `/user/*` - User management
- `/event/*` - Event operations
- `/review/*` - Review system
- `/payment/*` - Payment processing
- `/reports/*` - Analytics and statistics

## 💳 Payment Integration

### Stripe Integration Features
- **Secure Payments:** PCI-compliant payment processing
- **Payment Methods:** Credit/debit cards
- **Payment Intents:** Secure payment confirmation
- **Webhook Handling:** Real-time payment status updates
- **Revenue Tracking:** Comprehensive payment analytics
- **Refund Support:** Payment refund capabilities

### Payment Flow
1. User selects paid event
2. Payment intent created via Stripe
3. Secure payment form rendered
4. Payment processed and verified
5. Event participation confirmed
6. Payment recorded in system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rokon Khan**
- GitHub: [@Rokon-Khan](https://github.com/Rokon-Khan)
- LinkedIn: [Your LinkedIn Profile]
- Email: [Your Email]

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Stripe](https://stripe.com/) for secure payment processing
- [Vercel](https://vercel.com/) for seamless deployment

---

⭐ **Star this repository if you found it helpful!**