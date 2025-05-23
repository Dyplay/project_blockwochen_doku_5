# Documentation Portal

Modern documentation site with interactive 3D effects and password protection.

## Password Protection

The site is protected with a password authentication system:

1. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_SITE_PASSWORD=bsevita-43242025
   ```
   
2. The authentication system will:
   - Check if the user is already authorized in localStorage
   - If not, display a password input form
   - After successful authentication, the content will appear with a nice animation
   - The authentication status is saved in localStorage
   
3. Default password: `bsevita-43242025`

## Features

- Modern UI with animations and 3D effects
- Password protection for private documentation
- Decorative elements that respond to scrolling
- Table of contents navigation
- Responsive design
- Dark mode support
- Syntax highlighting for code blocks

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
``` 