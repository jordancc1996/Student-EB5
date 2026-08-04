import { useCallback, useState } from 'react';
import PlaybookExitIntentPopup from '@/components/PlaybookExitIntentPopup';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'playbook_exit_popup_shown';

function markShown() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

const PlaybookInteractive = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = useCallback(() => setIsPopupOpen(true), []);

  const handleOpenChange = (open: boolean) => {
    setIsPopupOpen(open);
    if (!open) markShown();
  };

  const handleDismiss = () => {
    markShown();
    setIsPopupOpen(false);
  };

  return (
    <>
      <PlaybookExitIntentPopup onOpen={openPopup} />
      <Dialog open={isPopupOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold text-foreground leading-snug">
              Before You Go — Get a Free EB-5 Strategy Call
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pt-1">
              Find out in 30 minutes if EB-5 makes sense for your F-1 or STEM OPT timeline.
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Our advisors work specifically with international students navigating OPT expiration, H-1B lottery
            risk, and the September 30, 2026 grandfathering deadline.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <Button asChild className="w-full h-11 font-semibold text-sm">
              <a href="/contact" onClick={markShown}>
                Schedule My Free Call
              </a>
            </Button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors duration-150"
            >
              No thanks, I&apos;ll figure it out myself
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaybookInteractive;
