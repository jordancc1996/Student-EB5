import { useState, useEffect, useCallback } from 'react';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import GuideDownloadModal from '@/components/GuideDownloadModal';

const GUIDE_TRIGGER_ID = 'guide-download-trigger';

const H1B60DayClockInteractive = () => {
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  const openGuideModal = useCallback(() => {
    setGuideModalOpen(true);
  }, []);

  const closeGuideModal = useCallback(() => {
    setGuideModalOpen(false);
  }, []);

  useEffect(() => {
    const trigger = document.getElementById(GUIDE_TRIGGER_ID);
    if (!trigger) return;

    const handleClick = () => openGuideModal();
    trigger.addEventListener('click', handleClick);
    return () => trigger.removeEventListener('click', handleClick);
  }, [openGuideModal]);

  return (
    <>
      <ExitIntentPopup onTrigger={openGuideModal} />
      <GuideDownloadModal isOpen={guideModalOpen} onClose={closeGuideModal} />
    </>
  );
};

export default H1B60DayClockInteractive;
