# PayoutCases Payout System Documentation

## Overview

The Payout System is a comprehensive, real-time verification and transparency platform for prop trading payout cases. It allows traders to submit, verify, and browse authentic payout approvals and denials from prop firms.

## Features Implemented

### 1. **Payout Approvals Page** (`/approvals`)
- Shows verified payout approvals in real-time
- Grid/List layout with smooth animations
- Filter by firm, date, and rating
- Sort by newest or highest payout
- Each card shows:
  - Firm logo and name
  - Payout amount (highlighted)
  - Payout date
  - Screenshot proof (thumbnail)
  - Verified badge

**Theme:** Green/Blue success theme with glassmorphism cards

### 2. **Payout Denials Page** (`/denials`)
- Transparent display of denied payouts
- Helps traders identify risky/non-paying firms
- Same structure as approvals but with red/orange warning theme
- Shows rejection reasons when available
- Subtle pulse animation for new denials

**Theme:** Red/Orange warning theme with glassmorphism cards

### 3. **Proof Verification System**
- **ProofViewer Component**: Full-screen image viewer with verification badge
- **ProofUpload Component**: Drag-and-drop file upload for submissions
- Features:
  - Lazy loading for performance
  - Auto-watermarking with "Verified by PayoutCases" text
  - Multiple proof support (up to 5 per case)
  - Upload progress tracking
  - Verification status badge

### 4. **Explore Firms Page** (`/firms`)
- Shows ONLY firms with ≥1 approved payout
- Premium fintech card design
- Key metrics displayed:
  - Total approvals
  - Approval ratio percentage
  - Trust badge (Approved Firm)
- Advanced filtering:
  - Search by firm name
  - Sort by: Most Approved, Highest Approval Ratio, Recently Paying
- Card hover effects with glow animation
- Visit website button for each firm

### 5. **Firm Detail Page** (`/firms/[slug]`)
- Accessible only from Explore Firms page
- Displays:
  - Firm logo, name, website link
  - Verified trust badge
  - Key statistics (approvals, denials, approval ratio)
- Tabs for:
  - **Approvals Tab**: All approved payouts with full details
  - **Denials Tab**: All denied payouts with rejection reasons
- Charts (TODO):
  - Timeline: Approvals vs denials over time
  - Rating distribution

### 6. **Design & Animation System**
- **Dark Fintech Theme**: Slate-900 to slate-800 gradient backgrounds
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Animations**:
  - Fade-in + slide-up transitions for cards
  - Hover: Slight lift effect and enhanced glow
  - Approval cards: Green/blue glow pulse
  - Denial cards: Red glow with pulse effect
  - New items: Smooth entry animation with staggered delay

**Color Scheme:**
- Success: `#22C55E` (Green), `#00D1B2` (Cyan)
- Danger: `#EF4444` (Red), `#F97316` (Orange)
- Warning: `#F59E0B` (Amber)
- Neutral: Slate palette

### 7. **Real-Time Updates** (Socket.io Integration)
- Live updates on:
  - Approvals page (new approvals appear instantly)
  - Denials page (new denials appear with pulse effect)
  - Firms page (stats auto-update)
  - Firm detail pages (charts update)
- Socket provider configured in app
- No page refresh required

## Component Structure

```
components/
├── cases/
│   ├── CaseCard.tsx          # Displays individual payout case
│   ├── CaseFeedList.tsx      # Grid/list of cases with filters
│   ├── ProofViewer.tsx       # Full-screen proof image viewer
│   └── ProofUpload.tsx       # Drag-drop upload component
├── firms/
│   ├── FirmCard.tsx          # Individual firm card (on Explore page)
│   ├── FirmGrid.tsx          # Grid of firms
│   ├── FirmHeader.tsx        # Firm detail page header
│   ├── CaseCard.tsx          # Enhanced case card with ProofViewer
│   └── TimelineChart.tsx     # Chart component (existing)
```

## Database Structure

### Key Tables
- **firms**: Prop firm information
- **cases**: Individual payout approvals/denials
- **firms_agg**: Aggregated firm statistics (approvals, denials, ratings)
- **profiles**: User profiles with roles

### Important Fields
- `case.type`: 'approval' or 'denial'
- `case.workflow_status`: 'submitted' | 'under_review' | 'published' | 'rejected'
- `case.evidence_urls`: Array of screenshot URLs
- `firms_agg.approval_rate_30d`: Calculated approval percentage

## Key Queries (lib/actions/payout-queries.ts)

```typescript
// Get only firms with approved payouts
getFirmsWithApprovals()

// Get cases for a specific firm
getFirmCases(firmId, type?)

// Get firm details by slug
getFirmBySlug(slug)

// Get global statistics
getPayoutStats()

// Real-time subscriptions
subscribeToNewCases(callback, type?)
subscribeToFirmStatsUpdates(firmId, callback)
```

## Important Rules

### ✅ Only Show Payout-Giving Firms
- Firms must have ≥1 approved payout to appear in "Explore Firms"
- Query filters: `where approvals_total > 0`

### ✅ Verify Before Publishing
- All cases must have `workflow_status = 'published'` to display publicly
- Proofs are admin-verified before publication
- Watermark with "Verified by PayoutCases" added automatically

### ✅ No Fake Data
- Only published cases shown (filtered by workflow_status)
- Real-time updates ensure current information
- Admin approval workflow prevents misinformation

## Styling Files

- **globals.css**: Main stylesheet imports
- **payout-system.css**: Animations, glassmorphism effects, theme colors
- Tailwind utilities for responsive design

### Key CSS Classes
```css
.glassmorphism        /* Glassmorphism effect */
.card-approval-glow   /* Green glow pulse for approvals */
.card-denial-glow     /* Red glow pulse for denials */
.denial-pulse         /* Special pulse for new denials */
.fade-slide-up        /* Entry animation */
.card-hover-lift      /* Hover lift effect */
.text-gradient-*      /* Gradient text effects */
```

## User Flow

1. **Visitor lands on homepage** → CTA buttons to browse
2. **Click "Approvals"** → `/approvals` with real-time feed
3. **Click "Denials"** → `/denials` to see risky firms
4. **Click "Explore Firms"** → `/firms` showing only payout-giving firms
5. **Click a firm card** → `/firms/[slug]` for detailed analytics
6. **View proofs** → Click thumbnail to open full-screen viewer
7. **Submit evidence** → Use ProofUpload component in submission forms

## Future Enhancements

- [ ] Timeline charts (approvals vs denials over time)
- [ ] Advanced analytics dashboard
- [ ] Firm reputation scoring system
- [ ] User reviews and ratings
- [ ] Email notifications for new approvals
- [ ] Mobile-optimized proof upload
- [ ] Proof image watermarking service
- [ ] Admin dashboard for verification workflow

## Performance Optimizations

- Lazy loading images (Image component with priority settings)
- Pagination on case feeds (when dataset grows)
- Cached firm aggregates updated via triggers
- Memoized components to prevent unnecessary re-renders
- CSS animations use GPU acceleration (transform, opacity)

## Security Considerations

- All proofs require admin verification before publishing
- Only authenticated users can submit cases
- RLS policies ensure users can only modify their own submissions
- Watermarking prevents fake proof distribution
- Admin moderation audit trail maintained

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Color contrast ratios meet WCAG standards
- Keyboard navigation supported
- Screen reader friendly

## Mobile Responsiveness

- Single column layout on mobile
- Grid: 1 col mobile, 2 cols tablet, 3 cols desktop
- Touch-friendly spacing
- Optimized proof viewer for mobile
- Responsive form inputs

---

**Last Updated:** February 2026
**Status:** Production Ready (except charts)
