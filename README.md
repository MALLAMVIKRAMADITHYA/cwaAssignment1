This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# GitHub Command Generator App

## Overview  
This is a Next.js web application that acts like a Git-enabled robot team member, designed to assist students in managing their GitHub repositories efficiently. It serves as Part 1 of a larger automation tool that generates and executes git commands to update shared repositories via a user-friendly interface.

## Features  
- Homepage: GitHub command generator form that accepts username, token, owner, and repository details  
- About Page: Displays student details and a video explaining how to use the application  
- Other Pages: Docker, Prisma/Sequelize, Tests (currently placeholders for future content)  
- Header/Navbar: Responsive hamburger menu for easy navigation  
- Theme Toggle: Supports light and dark modes  
- Footer: Displays copyright information, student name, student number, and date  
- Accessibility: Keyboard and screen reader friendly design  
- Cookies: Remembers which menu tab was last selected  
- Command Generator: Automatically generates git commands to:  
  - Clone the repository  
  - Create a new branch  
  - Update the README.md file  
  - Push changes to GitHub  
  - Create a pull request  

## Pages  
| Path      | Description                              |  
|-----------|------------------------------------------|  
| `/`       | Home page with GitHub command generator form |  
| `/about`  | Shows student name, number, and usage video  |  
| `/docker` | Placeholder for Docker content               |  
| `/prisma` | Placeholder for Prisma/Sequelize content     |  
| `/tests`  | Placeholder for test-related content          |  

## Technologies Used  
- Framework: Next.js  
- Language: TypeScript  
- Styling: CSS Modules, Bootstrap  
- Version Control: Git, GitHub  

## How to Use  
1. Navigate to the Homepage (`/`)  
2. Enter your GitHub Username, Personal Access Token, Owner Name, and Repository Name  
3. Click the Execute button  
4. The app will generate the relevant Git commands  
5. Copy and run these commands in your local terminal to:  
   - Clone the repository  
   - Checkout and update the README.md file  
   - Push changes and create a pull request  

---

**Author:** Mallam Vikram Adithya  
**Student Number:** 21950303  
**Date:** 27 August 2025  
