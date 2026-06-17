# Kohedha - Sri Lanka's Restaurant & Event Discovery App

A Next.js application with Sanity CMS integration for managing and displaying blog content about Sri Lanka's food and event scene.

## Features

- **Next.js 15** with App Router
- **Sanity CMS** for content management
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Portable Text** for rich content rendering

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended for best compatibility)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kohedha-public
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-06-01
   ```

   To get your Sanity project details:
   1. Go to [sanity.io/manage](https://sanity.io/manage)
   2. Create a new project or select an existing one
   3. Copy the Project ID from the project settings
   4. Update the `.env.local` file with your details

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main app: http://localhost:3000
   - Sanity Studio: http://localhost:3000/studio

## Blog System

### Creating Content

1. **Access Sanity Studio**
   - Navigate to http://localhost:3000/studio
   - Sign in with your Sanity account

2. **Create Content Types**
   - **Authors**: Create author profiles with name, image, and bio
   - **Categories**: Create categories for organizing posts
   - **Posts**: Create blog posts with title, content, author, and categories

3. **Content Structure**
   - **Posts** include: title, slug, author, main image, categories, published date, and body content
   - **Authors** include: name, slug, image, and bio
   - **Categories** include: title, slug, and description

### Frontend Integration

The blog system automatically:
- Fetches posts from Sanity CMS
- Displays them on the blog listing page (`/blog`)
- Shows individual blog posts (`/blog/[slug]`)
- Displays related posts
- Shows latest posts on the home page

### File Structure

```
├── app/
│   ├── blog/
│   │   ├── page.tsx              # Blog listing page
│   │   └── [slug]/page.tsx       # Individual blog post page
│   └── studio/[[...tool]]/page.tsx # Sanity Studio
├── components/
│   └── latest-posts.tsx          # Latest posts component for home page
├── lib/
│   └── sanity.ts                 # Sanity utilities and queries
├── sanity/
│   ├── lib/
│   │   ├── client.ts             # Sanity client configuration
│   │   └── image.ts              # Image URL builder
│   ├── schemaTypes/
│   │   ├── postType.ts           # Blog post schema
│   │   ├── authorType.ts         # Author schema
│   │   ├── categoryType.ts       # Category schema
│   │   └── blockContentType.ts   # Rich text content schema
│   └── env.ts                    # Environment variables
└── .env.local                    # Environment configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Content Management

### Adding New Blog Posts

1. Go to http://localhost:3000/studio
2. Click "Create new" → "Post"
3. Fill in the required fields:
   - **Title**: The blog post title
   - **Slug**: Auto-generated from title (or customize)
   - **Author**: Select from existing authors
   - **Main Image**: Upload or select an image
   - **Categories**: Select relevant categories
   - **Published At**: Set the publication date
   - **Body**: Write your content using the rich text editor
4. Click "Publish"

### Managing Authors

1. Go to http://localhost:3000/studio
2. Click "Create new" → "Author"
3. Add author details:
   - **Name**: Author's full name
   - **Image**: Author's profile picture
   - **Bio**: Author's biography

### Managing Categories

1. Go to http://localhost:3000/studio
2. Click "Create new" → "Category"
3. Add category details:
   - **Title**: Category name (e.g., "Restaurants", "Events")
   - **Description**: Brief description of the category

## Customization

### Styling

The blog uses Tailwind CSS for styling. You can customize:
- Colors and themes in `tailwind.config.ts`
- Component styles in the respective component files
- Global styles in `app/globals.css`

### Content Schema

To modify the content structure:
1. Edit the schema files in `sanity/schemaTypes/`
2. Add new fields or modify existing ones
3. Restart the development server

### Queries

The Sanity queries are defined in `lib/sanity.ts`. You can:
- Modify existing queries to fetch different data
- Add new queries for additional functionality
- Customize the data transformation logic

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS
   - Other platforms

3. **Set environment variables**
   - Ensure all Sanity environment variables are set in your deployment platform
   - Update CORS settings in your Sanity project if needed

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Ensure `.env.local` is in the root directory
   - Restart the development server after adding environment variables
   - Check that variable names match exactly

2. **Sanity Studio Not Loading**
   - Verify your project ID and dataset are correct
   - Check that your Sanity project is accessible
   - Ensure you're signed in to the correct Sanity account

3. **Images Not Displaying**
   - Check that image URLs are being generated correctly
   - Verify image assets are uploaded to Sanity
   - Ensure CORS settings allow your domain

### Getting Help

- Check the [Sanity documentation](https://www.sanity.io/docs)
- Review the [Next.js documentation](https://nextjs.org/docs)
- Check the console for error messages

## License

This project is licensed under the MIT License. 