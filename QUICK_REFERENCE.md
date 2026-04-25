# 🚀 PayoutCases Payout System - Quick Reference

## 📁 File Structure

```
payout-cases-landing/
├── app/
│   ├── approvals/
│   │   └── page.tsx                 ✅ Payout approvals page (enhanced)
│   ├── denials/
│   │   └── page.tsx                 ✅ Payout denials page (enhanced)
│   ├── firms/
│   │   ├── page.tsx                 ✅ Explore firms page (reimplemented)
│   │   └── [slug]/
│   │       └── page.tsx             ✅ Firm detail page (exists, enhanced)
│   └── globals.css                  ✅ Import payout-system.css
│
├── components/
│   ├── cases/
│   │   ├── CaseCard.tsx             ✅ Case display card
│   │   ├── CaseFeedList.tsx         ✅ Grid/list of cases (exists)
│   │   ├── ProofViewer.tsx          ✅ Full-screen proof viewer
│   │   └── ProofUpload.tsx          ✅ Drag-drop upload
│   └── firms/
│       └── CaseCard.tsx             ✅ Enhanced with ProofViewer
│
├── styles/
│   └── payout-system.css            ✅ Animations & theme
│
├── lib/actions/
│   └── payout-queries.ts            ✅ Database queries
│
├── hooks/
│   └── use-realtime-cases.ts        ✅ Real-time integration
│
└── Documentation/
    ├── BUILD_SUMMARY.md             📖 This build summary
    ├── PAYOUT_SYSTEM.md             📖 Complete documentation
    ├── IMPLEMENTATION_CHECKLIST.md  📖 Status & tasks
    └── SUPABASE_SETUP.md            📖 Backend configuration
```

---

## 🎯 Key Pages & Routes

| Page | Route | Theme | Purpose |
|------|-------|-------|---------|
| Approvals | `/approvals` | Green/Blue ✅ | Browse verified payouts |
| Denials | `/denials` | Red/Orange ⚠️ | See risky firms |
| Firms | `/firms` | Blue/Slate 🏢 | Explore payout-giving firms |
| Firm Detail | `/firms/[slug]` | Slate 📊 | Firm statistics & cases |

---

## 🎨 Design System

### Color Palette
```
Success/Approval:  #22C55E (Green)  →  #00D1B2 (Cyan)
Danger/Denial:     #EF4444 (Red)    →  #F97316 (Orange)
Warning:           #F59E0B (Amber)
Background:        #0F172A (Slate-900) → #1E293B (Slate-800)
Border:            rgba(148, 163, 184, 0.3)
```

### Animation Patterns
```
Entry:    Fade-in + slide-up (0.6s)
Hover:    Lift + glow (0.3s)
Glow:     Pulse effect (3s infinite)
Denial:   Pulse animation (2s on new)
```

### Typography
```
H1: 32-48px bold (white)
H2: 24-32px bold (white)
H3: 18-24px semibold (white)
Body: 14-16px regular (slate-300/400)
Label: 12px regular (slate-400)
```

---

## 📦 Components Quick Reference

### ProofViewer
```typescript
<ProofViewer
  imageUrl="https://..."
  verified={true}
  firmName="Firm Name"
/>
```

### ProofUpload
```typescript
<ProofUpload 
  onProofsChange={(urls) => console.log(urls)}
  maxProofs={5}
/>
```

### CaseCard (Cases Grid)
```typescript
<CaseCard
  id="case-id"
  type="approval"  // or "denial"
  firmName="Apex Trading"
  payoutAmount={5000}
  payoutDate="2024-01-15"
  proofUrl="https://..."
  rating={5}
  verified={true}
/>
```

---

## 🔧 Database Queries Reference

### Get Firms (Only with Approvals)
```typescript
import { getFirmsWithApprovals } from '@/lib/actions/payout-queries';

const firms = await getFirmsWithApprovals();
// Returns: [{ id, name, slug, logo_url, website, approvals_total, denials_total, approval_rate }]
```

### Get Firm Cases
```typescript
import { getFirmCases } from '@/lib/actions/payout-queries';

const cases = await getFirmCases(firmId, 'approval');
// Returns: Array of cases for the firm
```

### Real-Time Subscription
```typescript
import { subscribeToNewCases } from '@/lib/actions/payout-queries';

subscribeToNewCases(
  (newCase) => console.log('New case:', newCase),
  'approval'
);
```

---

## 🎬 Real-Time Integration

### Hook Usage
```typescript
import { useRealtimeCases } from '@/hooks/use-realtime-cases';

function Component() {
  useRealtimeCases('approval', (newCase) => {
    // Handle new case
  });
}
```

### With Notifications
```typescript
import { sendBrowserNotification } from '@/hooks/use-realtime-cases';

sendBrowserNotification('New Payout Approval', {
  body: 'Apex Trading - $5,000',
});
```

---

## ✅ Business Logic Rules

### Critical
1. ✅ **Only Show Payout-Giving Firms**
   - Filter: `WHERE approvals_total > 0`
   - Location: `getFirmsWithApprovals()` query

2. ✅ **Only Show Published Cases**
   - Filter: `WHERE workflow_status = 'published'`
   - All public queries use this

3. ✅ **Verify All Proofs**
   - Display verified badge when `workflow_status = 'published'`
   - Add watermark: "Verified by PayoutCases"

4. ✅ **Real-Time Updates**
   - No page refresh needed
   - New cases appear instantly
   - Firm stats auto-update

---

## 📊 CSS Classes Available

```css
/* Glassmorphism */
.glassmorphism

/* Animations */
.card-approval-glow    /* Green glow pulse */
.card-denial-glow      /* Red glow pulse */
.denial-pulse          /* New denial pulse */
.fade-slide-up         /* Entry animation */
.card-hover-lift       /* Hover lift + glow */
.shimmer               /* Loading shimmer */
.badge-pulse           /* Badge pulse effect */

/* Gradients */
.gradient-fintech-dark
.gradient-success
.gradient-danger
.gradient-warning

/* Text */
.text-gradient-success
.text-gradient-danger

/* Utilities */
.smooth-transition     /* 0.3s cubic-bezier */
.page-enter           /* Page entry animation */
```

---

## 🚀 Deployment Checklist

### Before Going Live

- [ ] Verify Supabase schema (run SQL checks in SUPABASE_SETUP.md)
- [ ] Enable real-time for `cases` and `firms_agg` tables
- [ ] Create database triggers (see SUPABASE_SETUP.md)
- [ ] Test all pages on desktop, tablet, mobile
- [ ] Test ProofUpload with various file sizes
- [ ] Test real-time subscriptions
- [ ] Verify only payout-giving firms show
- [ ] Set up monitoring/alerts
- [ ] Enable backups in Supabase dashboard

---

## 🐛 Troubleshooting

### Real-time not working?
→ Check SUPABASE_SETUP.md "Troubleshooting" section

### Firms not showing?
→ Verify `approvals_total > 0` filter is working
→ Run: `SELECT * FROM firms_agg WHERE approvals_total > 0;`

### Proofs not displaying?
→ Check `workflow_status = 'published'`
→ Verify image URLs are accessible
→ Check ProofViewer component props

### Animations stuttering?
→ Check GPU acceleration: use `transform` and `opacity` only
→ Disable heavy animations on low-end devices
→ Profile with DevTools Performance tab

---

## 📚 Documentation Map

| Document | Purpose | When to Use |
|----------|---------|------------|
| BUILD_SUMMARY.md | Overview of what was built | Getting started |
| PAYOUT_SYSTEM.md | Complete system documentation | Understanding features |
| IMPLEMENTATION_CHECKLIST.md | Status and next steps | Project planning |
| SUPABASE_SETUP.md | Backend configuration | Setting up database |
| QUICK_REFERENCE.md | This file | Quick lookups |

---

## 💡 Pro Tips

1. **Use mock data in development**
   ```sql
   INSERT INTO firms (name, slug) VALUES ('Test Firm', 'test-firm');
   INSERT INTO cases (firm_id, type, workflow_status) VALUES ('...', 'approval', 'published');
   ```

2. **Enable real-time in Supabase dashboard**
   → Settings → Realtime → Enable for tables

3. **Monitor case growth**
   ```sql
   SELECT COUNT(*) as total_cases, 
          COUNT(CASE WHEN type='approval' THEN 1 END) as approvals
   FROM cases WHERE workflow_status='published';
   ```

4. **Add CSS loader for slow networks**
   ```html
   <div className="shimmer">Loading...</div>
   ```

5. **Test mobile with ProxyMan/Charles**
   → Throttle network to see animations smoothness

---

## 🎓 Learning Resources

- **Animations:** Check `styles/payout-system.css` for keyframe examples
- **Components:** Review component files for JSDoc comments
- **Queries:** See `lib/actions/payout-queries.ts` for Supabase patterns
- **Real-time:** Study `hooks/use-realtime-cases.ts` for subscription patterns

---

## 📞 Quick Links

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

**Status:** ✅ 70% Complete - Ready for Real-time Integration  
**Last Updated:** February 2, 2026
