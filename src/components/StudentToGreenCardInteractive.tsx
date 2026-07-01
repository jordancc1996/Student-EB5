import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import StudentBottomForm from '@/components/StudentBottomForm';
import StudentLeadModal from '@/components/StudentLeadModal';
import StudentEligibilityModal from '@/components/StudentEligibilityModal';
import GiftedFundsModal from '@/components/GiftedFundsModal';
import StudentExitIntentPopup from '@/components/StudentExitIntentPopup';

const TUITION_TRIGGER_ID = 'student-lead-tuition-trigger';
const GUIDE_TRIGGER_ID = 'student-lead-guide-trigger';
const ELIGIBILITY_TRIGGER_ID = 'student-eligibility-trigger';
const GIFTED_FUNDS_TRIGGER_ID = 'student-gifted-funds-trigger';
const BOTTOM_FORM_ROOT_ID = 'student-bottom-form-root';

const StudentToGreenCardInteractive = () => {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalMode, setLeadModalMode] = useState<'tuition' | 'guide'>('tuition');
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [giftedFundsModalOpen, setGiftedFundsModalOpen] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
  const [formRoot, setFormRoot] = useState<HTMLElement | null>(null);

  const openLeadModal = useCallback((mode: 'tuition' | 'guide') => {
    setLeadModalMode(mode);
    setLeadModalOpen(true);
  }, []);

  useEffect(() => {
    setFormRoot(document.getElementById(BOTTOM_FORM_ROOT_ID));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const tuitionTrigger = document.getElementById(TUITION_TRIGGER_ID);
    const guideTrigger = document.getElementById(GUIDE_TRIGGER_ID);
    const eligibilityTrigger = document.getElementById(ELIGIBILITY_TRIGGER_ID);
    const giftedFundsTrigger = document.getElementById(GIFTED_FUNDS_TRIGGER_ID);

    const onTuition = () => openLeadModal('tuition');
    const onGuide = () => openLeadModal('guide');
    const onEligibility = () => setEligibilityModalOpen(true);
    const onGiftedFunds = () => setGiftedFundsModalOpen(true);

    tuitionTrigger?.addEventListener('click', onTuition);
    guideTrigger?.addEventListener('click', onGuide);
    eligibilityTrigger?.addEventListener('click', onEligibility);
    giftedFundsTrigger?.addEventListener('click', onGiftedFunds);

    return () => {
      tuitionTrigger?.removeEventListener('click', onTuition);
      guideTrigger?.removeEventListener('click', onGuide);
      eligibilityTrigger?.removeEventListener('click', onEligibility);
      giftedFundsTrigger?.removeEventListener('click', onGiftedFunds);
    };
  }, [openLeadModal]);

  return (
    <>
      {formRoot &&
        createPortal(
          <StudentBottomForm onSubmitted={() => setHasSubmittedForm(true)} />,
          formRoot,
        )}

      <StudentLeadModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} mode={leadModalMode} />
      <StudentEligibilityModal isOpen={eligibilityModalOpen} onClose={() => setEligibilityModalOpen(false)} />
      <GiftedFundsModal open={giftedFundsModalOpen} onOpenChange={setGiftedFundsModalOpen} />
      <StudentExitIntentPopup hasSubmittedForm={hasSubmittedForm} />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg p-4 transform transition-transform duration-300 ${
          showStickyCTA ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <p className="text-sm md:text-base font-medium text-foreground hidden sm:block">
            Don't let the H-1B lottery decide your future.
          </p>
          <Button
            onClick={() => {
              document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="ml-auto whitespace-nowrap bg-cta-navy hover:bg-cta-navy/90"
          >
            Get My Free Evaluation
          </Button>
        </div>
      </div>
    </>
  );
};

export default StudentToGreenCardInteractive;
