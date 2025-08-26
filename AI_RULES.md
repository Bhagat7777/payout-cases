# AI Development Rules

## Tech Stack

• **Framework**: Next.js 14 with App Router
• **Language**: TypeScript
• **Styling**: Tailwind CSS with custom color palette
• **UI Components**: shadcn/ui library (built on Radix UI primitives)
• **Database**: Supabase (PostgreSQL with real-time subscriptions)
• **Authentication**: Supabase Auth
• **File Storage**: Supabase Storage
• **Animations**: Framer Motion
• **Charts**: Recharts
• **Icons**: Lucide React

## Component Library Rules

### Use shadcn/ui for:
• Form elements (Input, Textarea, Select, etc.)
• Layout components (Card, Dialog, Sheet)
• Data display (Table, Badge, Avatar)
• Interactive elements (Button, Toggle, Switch)
• Navigation (Tabs, Breadcrumb, Pagination)
• Feedback (Toast, Alert, Skeleton)
• Complex components (Calendar, Chart, Carousel)

### Use Radix UI directly for:
• When a specific primitive isn't available in shadcn/ui
• Custom implementations requiring lower-level access
• Components with complex accessibility requirements

## Styling Guidelines

### Tailwind CSS:
• Use the existing color palette defined in globals.css
• Prefer utility classes over custom CSS
• Use responsive prefixes (sm:, md:, lg:) consistently
• Leverage Tailwind's spacing scale for consistent margins/padding

### Custom Classes:
• Only when Tailwind utilities are insufficient
• Must be defined in globals.css
• Should follow BEM naming convention
• Document complex custom classes

## Data Management

### Supabase:
• Use Supabase client for real-time subscriptions
• Implement RLS (Row Level Security) for data protection
• Use Supabase Storage for file uploads
• Follow Supabase best practices for query optimization

### Server Actions:
• Use for database mutations
• Implement proper error handling
• Use revalidatePath for cache invalidation
• Redirect appropriately after successful actions

## Performance Rules

### Animations:
• Use Framer Motion for complex animations
• Prefer CSS transitions for simple hover/focus states
• Always provide reduced motion alternatives
• Optimize animation performance with transform/opacity

### Data Fetching:
• Use Server Components for data fetching when possible
• Implement proper loading states with Suspense
• Use caching strategies appropriately
• Implement pagination for large datasets

## Accessibility Requirements

• All interactive elements must have proper focus states
• Color contrast must meet WCAG 2.1 AA standards
• All images must have descriptive alt text
• Form elements must have associated labels
• ARIA attributes must be used correctly when needed
• Keyboard navigation must be fully supported

## File Structure Rules

• Components: `/components` directory
• Pages: `/app` directory following Next.js App Router conventions
• Server Actions: `/lib/actions`
• Database Queries: `/lib/queries`
• Supabase utilities: `/lib/supabase`
• UI Components: `/components/ui` (shadcn/ui components)
• Custom Components: `/components` (non-ui components)
• Hooks: `/hooks` directory

## Third-Party Libraries

### Approved Libraries:
• date-fns (date manipulation)
• zod (validation)
• react-hook-form (form handling)
• lucide-react (icons)
• framer-motion (animations)
• recharts (data visualization)
• cmdk (command palette)
• embla-carousel-react (carousel)

### Adding New Libraries:
• Must be approved by lead developer
• Should solve a specific problem not addressed by existing tools
• Must have good TypeScript support
• Should be actively maintained with good community support