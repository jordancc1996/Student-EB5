import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import GuideDownloadModal from '@/components/GuideDownloadModal';
import CalculatorLeadModal from '@/components/CalculatorLeadModal';
import QualificationModal from '@/components/QualificationModal';
import FeasibilityModal from '@/components/FeasibilityModal';

const CALC_LEAD_TRIGGER_ID = 'h1b-calc-lead-trigger';
const GUIDE_TRIGGER_ID = 'h1b-guide-trigger';
const FEASIBILITY_COMPARISON_TRIGGER_ID = 'h1b-feasibility-trigger-comparison';
const QUALIFICATION_TRIGGER_ID = 'h1b-qualification-trigger';
const FEASIBILITY_BOTTOM_TRIGGER_ID = 'h1b-feasibility-trigger-bottom';

const H1BToGreenCardInteractive = () => {
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [qualModalOpen, setQualModalOpen] = useState(false);
  const [feasModalOpen, setFeasModalOpen] = useState(false);
  const [calcLeadModalOpen, setCalcLeadModalOpen] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  const openGuideModal = useCallback(() => setGuideModalOpen(true), []);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const calcLeadTrigger = document.getElementById(CALC_LEAD_TRIGGER_ID);
    const guideTrigger = document.getElementById(GUIDE_TRIGGER_ID);
    const feasComparisonTrigger = document.getElementById(FEASIBILITY_COMPARISON_TRIGGER_ID);
    const qualTrigger = document.getElementById(QUALIFICATION_TRIGGER_ID);
    const feasBottomTrigger = document.getElementById(FEASIBILITY_BOTTOM_TRIGGER_ID);

    const onCalcLead = () => setCalcLeadModalOpen(true);
    const onGuide = () => setGuideModalOpen(true);
    const onFeas = () => setFeasModalOpen(true);
    const onQual = () => setQualModalOpen(true);

    calcLeadTrigger?.addEventListener('click', onCalcLead);
    guideTrigger?.addEventListener('click', onGuide);
    feasComparisonTrigger?.addEventListener('click', onFeas);
    qualTrigger?.addEventListener('click', onQual);
    feasBottomTrigger?.addEventListener('click', onFeas);

    return () => {
      calcLeadTrigger?.removeEventListener('click', onCalcLead);
      guideTrigger?.removeEventListener('click', onGuide);
      feasComparisonTrigger?.removeEventListener('click', onFeas);
      qualTrigger?.removeEventListener('click', onQual);
      feasBottomTrigger?.removeEventListener('click', onFeas);
    };
  }, []);

  return (
    <>
      <ExitIntentPopup onTrigger={openGuideModal} />
      <GuideDownloadModal isOpen={guideModalOpen} onClose={() => setGuideModalOpen(false)} />
      <CalculatorLeadModal isOpen={calcLeadModalOpen} onClose={() => setCalcLeadModalOpen(false)} />
      <QualificationModal isOpen={qualModalOpen} onClose={() => setQualModalOpen(false)} />
      <FeasibilityModal isOpen={feasModalOpen} onClose={() => setFeasModalOpen(false)} />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg p-4 transform transition-transform duration-300 ${
          showStickyCTA ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <p className="text-sm md:text-base font-medium text-foreground hidden sm:block">
            Secure your priority date today.
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

export default H1BToGreenCardInteractive;
