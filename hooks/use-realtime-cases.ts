// Real-time updates integration for PayoutCases
// This file shows how to integrate real-time updates using socket.io or Supabase realtime

import { useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

/**
 * Hook for real-time case updates
 * Subscribes to new approvals or denials
 */
export function useRealtimeCases(
  caseType: 'approval' | 'denial',
  onNewCase: (caseData: any) => void
) {
  const supabase = createBrowserClient();

  useEffect(() => {
    // Subscribe to real-time case inserts
    const channel = supabase
      .channel(`cases_${caseType}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cases',
          filter: `type=eq.${caseType}&workflow_status=eq.published`,
        },
        (payload) => {
          // New case received
          onNewCase(payload.new);
          
          // Optional: Play notification sound
          playNotificationSound();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [caseType, onNewCase, supabase]);
}

/**
 * Hook for real-time firm statistics updates
 * Subscribes to changes in approval/denial counts
 */
export function useRealtimeFirmStats(
  firmId: string,
  onStatsChange: (stats: any) => void
) {
  const supabase = createBrowserClient();

  useEffect(() => {
    const channel = supabase
      .channel(`firm_agg_${firmId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'firms_agg',
          filter: `firm_id=eq.${firmId}`,
        },
        (payload) => {
          onStatsChange(payload.new);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [firmId, onStatsChange, supabase]);
}

/**
 * Usage in components:
 * 
 * export function ApprovalsPage() {
 *   const [cases, setCases] = useState([]);
 * 
 *   const handleNewCase = useCallback((newCase) => {
 *     // Add to beginning of list with animation
 *     setCases(prev => [newCase, ...prev]);
 *   }, []);
 * 
 *   useRealtimeCases('approval', handleNewCase);
 * 
 *   return (
 *     <AnimatePresence>
 *       {cases.map(caseItem => (
 *         <motion.div
 *           key={caseItem.id}
 *           initial={{ opacity: 0, y: 20 }}
 *           animate={{ opacity: 1, y: 0 }}
 *           exit={{ opacity: 0, y: -20 }}
 *         >
 *           <CaseCard caseItem={caseItem} />
 *         </motion.div>
 *       ))}
 *     </AnimatePresence>
 *   );
 * }
 */

/**
 * Helper function to play notification sound
 */
function playNotificationSound() {
  try {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // Audio play failed (might be blocked by browser)
      console.log('Notification sound could not play');
    });
  } catch (error) {
    console.error('Error playing notification:', error);
  }
}

/**
 * Browser notification for new payouts
 */
export function sendBrowserNotification(
  title: string,
  options?: NotificationOptions
) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo.png',
      badge: '/badge.png',
      ...options,
    });
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

/**
 * Integration example for CaseFeedList component:
 * 
 * export function CaseFeedList({ type }: CaseFeedListProps) {
 *   const [cases, setCases] = useState([]);
 * 
 *   // Listen for new cases
 *   useRealtimeCases(type, (newCase) => {
 *     setCases(prev => [newCase, ...prev]);
 *     
 *     // Send notification
 *     sendBrowserNotification(
 *       `New Payout ${type === 'approval' ? 'Approval' : 'Denial'}`,
 *       {
 *         body: `${newCase.firms?.name} - $${newCase.payout_amount}`,
 *         tag: `case-${newCase.id}`,
 *       }
 *     );
 *   });
 * 
 *   return (
 *     // Your component JSX
 *   );
 * }
 */

/**
 * Database triggers needed for real-time to work:
 * 
 * -- Trigger to update firms_agg when new case is published
 * CREATE OR REPLACE FUNCTION update_firm_agg()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   IF NEW.workflow_status = 'published' THEN
 *     UPDATE firms_agg
 *     SET
 *       approvals_total = CASE WHEN NEW.type = 'approval' 
 *                          THEN approvals_total + 1 
 *                          ELSE approvals_total END,
 *       denials_total = CASE WHEN NEW.type = 'denial' 
 *                        THEN denials_total + 1 
 *                        ELSE denials_total END,
 *       last_case_at = NOW()
 *     WHERE firm_id = NEW.firm_id;
 *   END IF;
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql;
 * 
 * CREATE TRIGGER update_firm_agg_trigger
 * AFTER INSERT ON cases
 * FOR EACH ROW
 * EXECUTE FUNCTION update_firm_agg();
 */