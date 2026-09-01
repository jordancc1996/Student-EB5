/**
 * Pathway-specific CTA copy — mirrors secondaryCtaText on pathway landing pages.
 * Used by research article CTAs (TOC, post-intro, mid-article, bottom form).
 */
export interface PathwayCtaCopy {
  id: string;
  url: string;
  /** Short label for pathway links, e.g. "tech workers" */
  audienceLabel: string;
  /** Matches pathway page secondaryCtaText */
  formHeadline: string;
  formSubheadline: string;
  midHeadline: string;
  midBody: string;
  postIntroHeadline: string;
  postIntroBody: string;
}

export const PATHWAY_CTA_COPY: Record<string, PathwayCtaCopy> = {
  'h1b-to-green-card': {
    id: 'h1b-to-green-card',
    url: '/pathways/h1b-to-green-card',
    audienceLabel: 'H-1B professionals',
    formHeadline: 'Talk to Someone About EB-5 for H-1B Holders',
    formSubheadline:
      'Book a free 30-minute consultation. See whether self-sponsored EB-5 fits your H-1B timeline and learn the next step.',
    midHeadline: 'See the EB-5 Path From H-1B to Green Card',
    midBody:
      'EB-5 is the only self-sponsored green card path that removes employer dependency and bypasses decades-long employment-based backlogs.',
    postIntroHeadline: 'On H-1B and weighing a green card?',
    postIntroBody: 'See the self-sponsored EB-5 path built for H-1B professionals.',
  },
  'f1-to-eb5-self-sponsored-green-card': {
    id: 'f1-to-eb5-self-sponsored-green-card',
    url: '/pathways/f1-to-eb5-self-sponsored-green-card',
    audienceLabel: 'international students',
    formHeadline: 'Talk to Someone Who Understands the F-1 to EB-5 Path',
    formSubheadline:
      'Book a free 30-minute consultation. See whether self-sponsored EB-5 fits your F-1 or OPT timeline before status runs out.',
    midHeadline: 'See the EB-5 Path From Student Visa to Green Card',
    midBody:
      'EB-5 can secure permanent residency without the H-1B lottery or employer sponsorship after graduation.',
    postIntroHeadline: 'On F-1 or OPT and planning beyond graduation?',
    postIntroBody: 'See the self-sponsored green card path for international students.',
  },
  'h1b-60-day-clock': {
    id: 'h1b-60-day-clock',
    url: '/pathways/h1b-60-day-clock',
    audienceLabel: 'H-1B workers in the grace period',
    formHeadline: 'Talk to Someone About EB-5 During the H-1B Grace Period',
    formSubheadline:
      'Book a free 30-minute consultation. Understand your options before the 60-day clock runs out.',
    midHeadline: 'In the H-1B Grace Period? See Your EB-5 Options',
    midBody:
      'Self-sponsored EB-5 can be evaluated alongside transfer, departure, or other status options while your grace period is active.',
    postIntroHeadline: 'Facing an H-1B layoff or grace period deadline?',
    postIntroBody: 'See the pathway guide for H-1B workers on the 60-day clock.',
  },
  'eb5-for-indian-h1b': {
    id: 'eb5-for-indian-h1b',
    url: '/pathways/eb5-for-indian-h1b',
    audienceLabel: 'Indian H-1B professionals',
    formHeadline: 'Talk to Someone About EB-5 for Indian H-1B Holders',
    formSubheadline:
      'Book a free 30-minute consultation. See whether EB-5 fits your situation given India-specific backlog timelines.',
    midHeadline: 'Indian H-1B Backlog? See the EB-5 Alternative',
    midBody:
      'EB-5 reserved categories can bypass decades-long EB-2 and EB-3 waits for Indian nationals with qualifying capital.',
    postIntroHeadline: 'Indian professional stuck in the green card backlog?',
    postIntroBody: 'See the EB-5 path built for Indian H-1B holders.',
  },
  'eb5-for-tech-workers': {
    id: 'eb5-for-tech-workers',
    url: '/pathways/eb5-for-tech-workers',
    audienceLabel: 'tech workers',
    formHeadline: 'Talk to Someone About EB-5 for Tech Workers',
    formSubheadline:
      'Book a free 30-minute consultation. Find out if EB-5 fits your situation as a tech professional and learn the next step.',
    midHeadline: 'H-1B Uncertainty? See the EB-5 Path for Tech Workers',
    midBody:
      'O-1 and EB-1A require extraordinary-ability proof most skilled professionals cannot meet. EB-5 is self-sponsored, has no lottery, and removes employer dependency.',
    postIntroHeadline: 'Considering EB-5 instead of O-1 or EB-1A?',
    postIntroBody: 'See the self-sponsored path built for skilled tech professionals.',
  },
  'eb5-for-wealthy-families': {
    id: 'eb5-for-wealthy-families',
    url: '/pathways/eb5-for-wealthy-families',
    audienceLabel: 'high-net-worth families',
    formHeadline: 'Talk to Someone About EB-5 for High-Net-Worth Families',
    formSubheadline:
      'Book a free 30-minute consultation. See whether EB-5 fits your family’s capital, timeline, and residency goals.',
    midHeadline: 'Planning Family Residency Through EB-5?',
    midBody:
      'The program can cover spouse and unmarried children under 21 in one filing when capital and source-of-funds documentation are in place.',
    postIntroHeadline: 'Evaluating EB-5 as a family residency strategy?',
    postIntroBody: 'See the pathway guide for high-net-worth families.',
  },
  'eb5-vs-other-visa-options': {
    id: 'eb5-vs-other-visa-options',
    url: '/pathways/eb5-vs-other-visa-options',
    audienceLabel: 'visa and residency planners',
    formHeadline: 'Talk to Someone About Comparing Visa and Residency Paths',
    formSubheadline:
      'Book a free 30-minute consultation. Compare EB-5 against other U.S. and global residency options for your situation.',
    midHeadline: 'Comparing Residency Paths? Start With EB-5',
    midBody:
      'See how EB-5 stacks up against E-2, L-1, O-1, and golden visa programs on capital, timeline, and family coverage.',
    postIntroHeadline: 'Weighing multiple residency options?',
    postIntroBody: 'See the structured comparison path for EB-5 and other visa options.',
  },
  'rural-eb5': {
    id: 'rural-eb5',
    url: '/pathways/rural-eb5',
    audienceLabel: 'rural EB-5 investors',
    formHeadline: 'Talk to Someone About Rural EB-5',
    formSubheadline:
      'Book a free 30-minute consultation. Learn how rural reserved categories and project selection fit your timeline.',
    midHeadline: 'Considering Rural EB-5?',
    midBody:
      'Rural projects qualify for the $800,000 TEA minimum and may access reserved visa numbers with faster processing.',
    postIntroHeadline: 'Evaluating a rural EB-5 project?',
    postIntroBody: 'See the dedicated pathway for rural EB-5 investors.',
  },
  'eb5-project-due-diligence': {
    id: 'eb5-project-due-diligence',
    url: '/pathways/eb5-project-due-diligence',
    audienceLabel: 'EB-5 project diligence',
    formHeadline: 'Talk to Someone About EB-5 Project Diligence',
    formSubheadline:
      'Book a free 30-minute consultation. Get a structured read on project risk before you wire capital.',
    midHeadline: 'Ready to Evaluate an EB-5 Project?',
    midBody:
      'Due diligence on regional center track record, job creation, and exit strategy should happen before any subscription agreement is signed.',
    postIntroHeadline: 'Researching EB-5 project structure?',
    postIntroBody: 'See the project due diligence pathway before you commit capital.',
  },
  'eb5-source-of-funds': {
    id: 'eb5-source-of-funds',
    url: '/pathways/eb5-source-of-funds',
    audienceLabel: 'EB-5 source of funds',
    formHeadline: 'Talk to Someone About EB-5 Source of Funds',
    formSubheadline:
      'Book a free 30-minute consultation. Confirm whether your capital trail meets USCIS documentation standards.',
    midHeadline: 'Documenting EB-5 Source of Funds?',
    midBody:
      'Every dollar of the investment must trace to lawful, fully documented origin. See the pathway for gifts, loans, business income, and more.',
    postIntroHeadline: 'Planning how to fund your EB-5 investment?',
    postIntroBody: 'See the source-of-funds pathway and documentation checklist.',
  },
  'eb5-concurrent-filing': {
    id: 'eb5-concurrent-filing',
    url: '/pathways/eb5-concurrent-filing',
    audienceLabel: 'concurrent filing',
    formHeadline: 'Talk to Someone About Concurrent Filing',
    formSubheadline:
      'Book a free 30-minute consultation. See whether I-526E and I-485 can be filed together for your visa status.',
    midHeadline: 'Eligible for EB-5 Concurrent Filing?',
    midBody:
      'Filing I-526E and I-485 together can deliver work and travel authorization while the petition is pending.',
    postIntroHeadline: 'Already in the U.S. on a qualifying visa?',
    postIntroBody: 'See the concurrent filing pathway and timeline.',
  },
  'eb5-child-aging-out': {
    id: 'eb5-child-aging-out',
    url: '/pathways/eb5-child-aging-out',
    audienceLabel: 'families with dependent children',
    formHeadline: 'Talk to Someone About EB-5 and Dependent Children',
    formSubheadline:
      'Book a free 30-minute consultation. Understand CSPA protection and filing timing for children approaching age 21.',
    midHeadline: 'Worried About a Child Aging Out?',
    midBody:
      'Rural EB-5 filing and CSPA calculation can protect derivative children when employment-based backlogs run long.',
    postIntroHeadline: 'Dependent child approaching 21 on a backlog case?',
    postIntroBody: 'See the EB-5 pathway for families facing aging-out risk.',
  },
  'i956f-approved-eb5-projects': {
    id: 'i956f-approved-eb5-projects',
    url: '/pathways/i956f-approved-eb5-projects',
    audienceLabel: 'I-956F project review',
    formHeadline: 'Talk to Someone About EB-5 Project Approvals',
    formSubheadline:
      'Book a free 30-minute consultation. Learn what I-956F approval means and what diligence still applies.',
    midHeadline: 'Evaluating I-956F Project Status?',
    midBody:
      'Form I-956F approval is one diligence checkpoint, not a substitute for independent project and regional center review.',
    postIntroHeadline: 'Researching I-956F approval status?',
    postIntroBody: 'See the pathway for projects with USCIS Form I-956F filings.',
  },
  'eb5-for-families-with-us-students': {
    id: 'eb5-for-families-with-us-students',
    url: '/pathways/eb5-for-families-with-us-students',
    audienceLabel: 'families with U.S. students',
    formHeadline: 'Talk to Someone About EB-5 for Your Student Family',
    formSubheadline:
      'Book a free 30-minute consultation. See how parent-funded EB-5 can fit your student’s long-term status plan.',
    midHeadline: 'Funding EB-5 for a Student in the U.S.?',
    midBody:
      'Parent gifts and cross-border transfers are common funding paths when a family supports a student’s green card strategy.',
    postIntroHeadline: 'Parent exploring EB-5 for a child studying in the U.S.?',
    postIntroBody: 'See the pathway for families with students in America.',
  },
  'eb5-for-opt-students': {
    id: 'eb5-for-opt-students',
    url: '/pathways/eb5-for-opt-students',
    audienceLabel: 'OPT and STEM OPT students',
    formHeadline: 'Talk to Someone About Your OPT Timeline and EB-5',
    formSubheadline:
      'Book a free 30-minute consultation. Map EB-5 filing against your OPT end date and cap-gap window.',
    midHeadline: 'On OPT and Running Out of Time?',
    midBody:
      'EB-5 concurrent filing can bridge the gap between OPT expiration and a self-sponsored green card path.',
    postIntroHeadline: 'On OPT or STEM OPT and planning past expiration?',
    postIntroBody: 'See the EB-5 pathway built for OPT students.',
  },
  'eb5-risk-and-due-diligence': {
    id: 'eb5-risk-and-due-diligence',
    url: '/pathways/eb5-risk-and-due-diligence',
    audienceLabel: 'EB-5 risk and diligence',
    formHeadline: 'Talk to Someone Who Will Give You a Straight Answer About EB-5 Risk',
    formSubheadline:
      'Book a free 30-minute consultation. Get an honest read on capital at risk, project selection, and program fit.',
    midHeadline: 'Is EB-5 Worth the Risk for You?',
    midBody:
      'Capital is at risk until job creation and I-829 requirements are met. See the structured diligence path before you commit.',
    postIntroHeadline: 'Weighing EB-5 risk before you invest?',
    postIntroBody: 'See the due diligence pathway and capital requirements.',
  },
};

export function getPathwayCtaCopy(pathwayId: string): PathwayCtaCopy | undefined {
  return PATHWAY_CTA_COPY[pathwayId];
}
