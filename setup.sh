#!/bin/bash

# PmitG Monorepo Setup Script
echo "🍮 Setting up PmitG Monorepo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        
        # Check if version is 20 or higher
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -lt 20 ]; then
            print_warning "Node.js version 20+ is recommended. Current version: $NODE_VERSION"
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 20+ and try again."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
}

# Check if MongoDB is running (optional)
check_mongodb() {
    print_status "Checking MongoDB connection..."
    if command -v mongosh &> /dev/null; then
        if mongosh --eval "db.runCommand('ping')" --quiet &> /dev/null; then
            print_success "MongoDB is running"
        else
            print_warning "MongoDB is not running. Please start MongoDB or use MongoDB Atlas."
            print_status "You can start MongoDB with: mongod"
        fi
    else
        print_warning "MongoDB client not found. Please install MongoDB or use MongoDB Atlas."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Install workspace dependencies
    print_status "Installing workspace dependencies..."
    npm run install:all
    
    print_success "Dependencies installed successfully"
}

# Setup environment files
setup_env() {
    print_status "Setting up environment files..."
    
    # Copy .env.example to .env if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from template"
    else
        print_warning ".env file already exists, skipping..."
    fi
    
    # Copy backend .env.example to .env if it doesn't exist
    if [ ! -f apps/backend/.env ]; then
        cp apps/backend/.env.example apps/backend/.env
        print_success "Created backend .env file from template"
    else
        print_warning "Backend .env file already exists, skipping..."
    fi
    
    # Copy frontend .env.local if it doesn't exist
    if [ ! -f apps/frontend/.env.local ]; then
        cat > apps/frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF
        print_success "Created frontend .env.local file"
    else
        print_warning "Frontend .env.local file already exists, skipping..."
    fi
}

# Build shared package
build_shared() {
    print_status "Building shared package..."
    cd packages/shared
    npm run build
    cd ../..
    print_success "Shared package built successfully"
}

# Type check
type_check() {
    print_status "Running type checks..."
    npm run type-check
    if [ $? -eq 0 ]; then
        print_success "Type checks passed"
    else
        print_warning "Type checks failed - please review the errors above"
    fi
}

# Main setup function
main() {
    echo "🚀 Starting PmitG Monorepo Setup..."
    echo "=================================="
    
    # Pre-flight checks
    check_node
    check_npm
    check_mongodb
    
    echo ""
    print_status "Installing dependencies..."
    install_dependencies
    
    echo ""
    print_status "Setting up environment files..."
    setup_env
    
    echo ""
    print_status "Building shared package..."
    build_shared
    
    echo ""
    print_status "Running type checks..."
    type_check
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo "=================================="
    echo ""
    print_status "Next steps:"
    echo "1. Update environment variables in .env files if needed"
    echo "2. Start MongoDB (if using local instance): mongod"
    echo "3. Start development servers: npm run dev"
    echo "4. Open http://localhost:3000 in your browser"
    echo ""
    print_status "Available commands:"
    echo "  npm run dev              # Start both frontend and backend"
    echo "  npm run dev:frontend     # Start only frontend"
    echo "  npm run dev:backend      # Start only backend"
    echo "  npm run build            # Build all packages"
    echo "  npm run type-check       # Run type checks"
    echo "  npm run lint             # Run linting"
    echo ""
    print_success "Happy pudding meetup organizing! 🍮✨"
}

# Run main function
main "$@"
