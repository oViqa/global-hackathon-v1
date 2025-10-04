#!/bin/bash

# Pudding Gabel Meetup Platform - Quick Start Script
# This script automates the setup process

set -e  # Exit on error

echo "🍮 Pudding Gabel Meetup Platform - Quick Start"
echo "=============================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 15+ first."
    exit 1
fi

echo "✅ All prerequisites found!"
echo ""

# Check if database exists
echo "🗄️  Checking database..."
if psql -lqt | cut -d \| -f 1 | grep -qw puddingmeetup; then
    echo "✅ Database 'puddingmeetup' exists"
else
    echo "📦 Creating database 'puddingmeetup'..."
    createdb puddingmeetup || {
        echo "❌ Failed to create database. You may need to create it manually:"
        echo "   createdb puddingmeetup"
        exit 1
    }
    echo "✅ Database created!"
fi
echo ""

# Backend setup
echo "🔧 Setting up backend..."
cd backend

echo "📦 Installing backend dependencies..."
npm install

echo "🔨 Generating Prisma client..."
npx prisma generate

echo "🗃️  Running database migrations..."
npx prisma migrate dev --name init

echo "🌱 Seeding database with demo data..."
npm run seed

cd ..
echo "✅ Backend setup complete!"
echo ""

# Frontend setup
echo "🎨 Setting up frontend..."
cd frontend

echo "📦 Installing frontend dependencies..."
npm install

cd ..
echo "✅ Frontend setup complete!"
echo ""

echo "=============================================="
echo "🎉 Setup Complete!"
echo "=============================================="
echo ""
echo "To start the application, run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open your browser to: http://localhost:3000"
echo ""
echo "📧 Demo accounts:"
echo "  Email: user1@puddingmeetup.com"
echo "  Password: password123"
echo ""
echo "Happy pudding meetup organizing! 🍮✨"
