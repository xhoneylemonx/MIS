# MIS Interest Match 🎓

MIS Interest Match is a modern web application designed for Computer Science students at Maejo University. It serves as a unified platform to discover peers with similar interests, join specialized groups, and participate in academically or recreationally aligned activities.

## Features
- **REG Integration**: Syncs student data directly from the official Maejo REG system.
- **Student Profiles**: Personalize your profile with custom bios and interests.
- **Discover & Match**: Find students with shared interests using our matching algorithm.
- **Groups**: Create, join and manage specialized interest groups.
- **Activities**: Participate in upcoming events tailored to your interests.
- **Admin Dashboard**: Comprehensive MIS dashboard providing rich insights into student engagement.

## Technology Stack
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Custom Auth Session / Hooks

## Installation & Setup

1. **Clone the repository**
2. **Install dependencies**:  
   ```bash
   npm install
   ```
3. **Environment Setup**:  
   Copy `.env.example` to `.env` and fill in your PostgreSQL database variables.
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/mis_db"
   ```
4. **Database Migration & Seeding**:  
   Initialize the PostgreSQL database and insert required base data:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx ts-node prisma/seed-interests.ts
   npx ts-node seed.ts
   ```
5. **Run the Development Server**:  
   ```bash
   npm run dev
   ```

## Admin & Student Access
- The system operates via roles securely managed in the database.
- Admin paths (`/admin/*`) require special clearance which can be enabled via the PostgreSQL directly or synced.
- Students log in using their standard university credentials.
