# HabitFlow - Full-Stack Habit Tracker

A modern, full-stack habit tracking application built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL. Track your daily and weekly habits, connect with friends, and build better routines together.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with email/password
- **Habit Management**: Create, edit, delete, and track daily/weekly habits
- **Progress Tracking**: Visual progress indicators, streak counters, and completion statistics
- **Social Features**: Follow friends, view activity feeds, and get motivated together
- **Profile Management**: Customizable user profiles with habit statistics
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **Next.js 14**: App Router, Server Components, and API Routes
- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Tailwind CSS**: Modern, responsive styling with shadcn/ui components
- **JWT Authentication**: Secure, stateless authentication
- **Real-time Updates**: Dynamic UI updates without page refreshes

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod for schema validation
- **Deployment**: Vercel (Frontend) + Railway/Supabase (Database)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Local Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd habitflow
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/habitflow"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # Next.js
   NEXTAUTH_URL="http://localhost:3000"
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed the database (optional)
   npx prisma db seed
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication and profile information
- **Habit**: User-created habits with categories, frequency, and settings
- **Completion**: Records of habit completions with timestamps
- **Friendship**: Social connections between users

### Key Relationships
- Users can have multiple habits
- Habits can have multiple completions
- Users can follow other users (many-to-many relationship)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Habits
- `GET /api/habits` - Get user's habits with statistics
- `POST /api/habits` - Create new habit
- `PUT /api/habits/[id]` - Update habit
- `DELETE /api/habits/[id]` - Delete habit
- `POST /api/habits/[id]/checkin` - Check in to habit
- `DELETE /api/habits/[id]/checkin` - Undo habit check-in

### Social Features
- `GET /api/friends` - Get friends and activity feed
- `POST /api/friends` - Follow a user
- `DELETE /api/friends/[userId]` - Unfollow a user
- `GET /api/users/search` - Search for users to follow

### Profile
- `GET /api/profile` - Get user profile with statistics
- `PUT /api/profile` - Update user profile

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically detect Next.js and configure build settings

2. **Set Environment Variables**
   In your Vercel dashboard, add:
   \`\`\`
   DATABASE_URL=your-production-database-url
   JWT_SECRET=your-production-jwt-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   \`\`\`

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Your app will be available at `https://your-app.vercel.app`

### Database Deployment Options

#### Option 1: Railway
1. Create account at [Railway](https://railway.app)
2. Create new PostgreSQL database
3. Copy connection string to `DATABASE_URL`
4. Run migrations: `npx prisma db push`

#### Option 2: Supabase
1. Create account at [Supabase](https://supabase.com)
2. Create new project with PostgreSQL
3. Copy connection string to `DATABASE_URL`
4. Run migrations: `npx prisma db push`

#### Option 3: Neon
1. Create account at [Neon](https://neon.tech)
2. Create new PostgreSQL database
3. Copy connection string to `DATABASE_URL`
4. Run migrations: `npx prisma db push`

### Post-Deployment Steps

1. **Run Database Migrations**
   \`\`\`bash
   npx prisma db push
   \`\`\`

2. **Seed Database (Optional)**
   \`\`\`bash
   npx prisma db seed
   \`\`\`

3. **Test the Application**
   - Create a test account
   - Create some habits
   - Test all major features

## 📱 Usage

### Getting Started
1. **Sign Up**: Create an account with email and password
2. **Create Habits**: Add your first habit with name, category, and frequency
3. **Track Progress**: Check in daily/weekly to build streaks
4. **Connect with Friends**: Search and follow other users
5. **Stay Motivated**: View friends' activity and celebrate achievements

### Habit Categories
- **Health & Fitness**: Exercise, nutrition, sleep habits
- **Learning & Study**: Reading, courses, skill development
- **Personal Development**: Meditation, journaling, self-care
- **Work & Productivity**: Planning, focus, professional growth

### Social Features
- **Activity Feed**: See friends' recent habit completions
- **Following System**: Follow users to see their progress
- **Profile Sharing**: Showcase your habit statistics and achievements

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure, stateless authentication
- **Input Validation**: Zod schema validation on all inputs
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookie configuration

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Habit creation, editing, and deletion
- [ ] Daily and weekly check-ins
- [ ] Streak calculation accuracy
- [ ] Friend following/unfollowing
- [ ] Activity feed updates
- [ ] Profile editing
- [ ] Responsive design on mobile/desktop

### Edge Cases Covered
- Duplicate habit names per user (prevented)
- Multiple check-ins per day/week (prevented)
- Self-following (prevented)
- Invalid JWT tokens (handled)
- Database connection errors (handled)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## 🔮 Future Enhancements

- [ ] Email notifications and reminders
- [ ] Habit templates and suggestions
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] Habit sharing and challenges
- [ ] Integration with fitness trackers
- [ ] Gamification with points and badges
- [ ] Export data functionality

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
\`\`\`

```json file="" isHidden
