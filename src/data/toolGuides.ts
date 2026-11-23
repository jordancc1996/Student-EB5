import {
  FEASIBILITY_ADMIN_ALLOWANCE,
  FEASIBILITY_ATTORNEY_ALLOWANCE,
  FEASIBILITY_DEFAULT_MONTHLY_EXPENSES,
  FEASIBILITY_DOCS_ALLOWANCE,
  FEASIBILITY_RELOCATION_ALLOWANCE,
  FEASIBILITY_RESERVE_MONTHS,
  FEASIBILITY_USCIS_ALLOWANCE,
  GRANDFATHERING_FILING_DEADLINE,
  NON_TEA_INVESTMENT_THRESHOLD,
  RC_PROGRAM_AUTHORIZED_THROUGH,
  TEA_INVESTMENT_THRESHOLD,
  formatProgramDate,
  formatProgramDollars,
} from '@/data/program';

export interface ToolGuideStep {
  title: string;
  body: string;
}
export interface ToolGuideRule {
  text: string;
  label: string;
  href: string;
}
export interface ToolGuideLink {
  href: string;
  label: string;
}
export interface ToolGuideFaq {
  question: string;
  answer: string;
}
export interface ToolGuideData {
  toolName: string;
  h1: string;
  category: 'FinanceApplication' | 'UtilitiesApplication';
  steps: ToolGuideStep[];
  method: string[] | null;
  rules: ToolGuideRule[];
  example: { intro: string; inputs: string[]; result: string };
  faqs: ToolGuideFaq[];
  related: ToolGuideLink[];
  learn: ToolGuideLink[];
}

const cspaPolicy = 'https://www.uscis.gov/policy-manual/volume-7-part-a-chapter-7';
const eb5About =
  'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5/about-the-eb-5-visa-classification';
const visaBulletin = 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html';
const optPage =
  'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students';
const sofPolicy = 'https://www.uscis.gov/policy-manual/volume-6-part-g-chapter-2';
const processingTimes = 'https://egov.uscis.gov/processing-times/';
export const toolGuides = {
  cspa: {
    toolName: 'EB-5 CSPA age calculator',
    h1: 'EB-5 CSPA Age Calculator - Derivative Child Age-Out Risk',
    category: 'UtilitiesApplication',
    steps: [
      { title: 'Enter the child date of birth', body: 'Use the derivative child calendar date of birth. The calculator reads it as a UTC date so the result does not shift with the browser time zone.' },
      { title: 'Enter the I-526E filing date and approval date', body: 'These two dates set how long the petition was pending. The approval date cannot be earlier than the filing date.' },
      { title: 'Enter the visa availability date and calculate', body: 'Use the Final Action date you are testing. The tool then shows a CSPA age, the biological age, and the pending days it subtracted.' },
    ],
    method: [
      'The calculator treats the visa as available on the later of the Final Action date and the I-526E approval date. Biological age is the number of days from the child date of birth to that availability date, divided by 365.25.',
      'Pending time is the number of days from the I-526E filing date to the approval date. CSPA age equals biological age minus pending days divided by 365.25. A result under 20.5 is labeled Likely Protected. A result from 20.5 up to but not including 21 is labeled At Risk. A result of 21 or more is labeled Age-Out Risk Detected.',
    ],
    rules: [
      { text: 'The tool applies the pending-time subtraction described in the Child Status Protection Act materials already used on this site.', label: 'USCIS Policy Manual, Child Status Protection Act', href: cspaPolicy },
      { text: 'Visa availability in this calculator is the date you enter from the Visa Bulletin Final Action chart, or the approval date if that is later.', label: 'Visa Bulletin', href: visaBulletin },
      { text: 'The same pending-time idea is explained for EB-5 families in the site aging-out article.', label: 'EB-5 aging out article', href: '/research/eb5-visa-aging-out-crisis-solution' },
    ],
    example: {
      intro: 'A child born on June 1, 2010, with an I-526E filed January 15, 2024, approved January 15, 2026, and a Final Action date of June 1, 2026.',
      inputs: ['Date of birth: 2010-06-01', 'I-526E filing date: 2024-01-15', 'I-526E approval date: 2026-01-15', 'Visa availability date: 2026-06-01'],
      result: 'The tool returns Likely Protected, a CSPA age of 14.00 years, a biological age of 16.00 years, and 731 pending days subtracted.',
    },
    faqs: [
      { question: 'What age does the EB-5 CSPA calculator use?', answer: 'It uses the date of birth you enter and the later of the approval date and the Final Action date. It does not use the current date. Change the visa availability date if you want to test a different bulletin.' },
      { question: 'Does a CSPA age under 21 mean the child is approved?', answer: 'No. The label is an arithmetic result from the four dates. USCIS still requires the child to seek to acquire status within one year of visa availability. The on-screen note says the same thing for the Likely Protected result.' },
      { question: 'Why does the calculator use 365.25 days per year?', answer: 'The age math divides day counts by 365.25 so leap days do not move the result by a full day. Both the biological age and the pending-time credit use that divisor.' },
      { question: 'What if the approval date is before the filing date?', answer: 'The calculator stops and asks you to correct the dates. It will not produce a CSPA age when the approval is earlier than the filing.' },
      { question: 'Does this replace a CSPA analysis for an I-140?', answer: 'No. The fields are the I-526E filing date, the I-526E approval date, and an EB-5 Final Action date. An employment-based I-140 uses the same statute, but this form is built for the EB-5 dates above.' },
    ],
    related: [
      { href: '/tools/eb5-concurrent-filing-eligibility', label: 'EB-5 concurrent filing checker' },
      { href: '/tools/grandfathering-countdown', label: 'EB-5 grandfathering countdown' },
      { href: '/tools/eb5-source-of-funds-checklist', label: 'EB-5 source of funds checklist' },
    ],
    learn: [
      { href: '/research/eb5-visa-aging-out-crisis-solution', label: 'EB-5 aging out and rural filing' },
      { href: '/pathways/eb5-child-aging-out', label: 'EB-5 for children aging out' },
      { href: '/faq/child-aging-out-green-card-cspa-eb5', label: 'FAQ: child aging out, CSPA, and EB-5' },
    ],
  },
  feasibility: {
    toolName: 'EB-5 investment feasibility calculator',
    h1: 'EB-5 Investment Feasibility Calculator - $800K TEA Eligibility Check',
    category: 'FinanceApplication',
    steps: [
      { title: 'Enter the financial snapshot', body: `Fill liquid assets, semi-liquid assets, monthly expenses, and debts. Monthly expenses start at ${formatProgramDollars(FEASIBILITY_DEFAULT_MONTHLY_EXPENSES)} dollars if you leave that field alone.` },
      { title: 'Choose TEA or standard investment', body: `TEA uses the ${formatProgramDollars(TEA_INVESTMENT_THRESHOLD)} dollar capital amount. Standard uses ${formatProgramDollars(NON_TEA_INVESTMENT_THRESHOLD)} dollars. Those figures are the investment only.` },
      { title: 'Read the position label', body: 'The page shows Strong Position, Moderate Position, or a shortfall. The label updates as you change the numbers. Use Print Report if you want a paper copy.' },
    ],
    method: [
      `The investment amount is ${formatProgramDollars(TEA_INVESTMENT_THRESHOLD)} dollars for TEA or ${formatProgramDollars(NON_TEA_INVESTMENT_THRESHOLD)} dollars otherwise. The tool then adds fixed planning figures: ${formatProgramDollars(FEASIBILITY_ATTORNEY_ALLOWANCE)} attorney, ${formatProgramDollars(FEASIBILITY_USCIS_ALLOWANCE)} USCIS, ${formatProgramDollars(FEASIBILITY_ADMIN_ALLOWANCE)} administration, ${formatProgramDollars(FEASIBILITY_DOCS_ALLOWANCE)} documents, and ${formatProgramDollars(FEASIBILITY_RELOCATION_ALLOWANCE)} relocation. That sum is the EB-5 cost stack in this calculator.`,
      `A ${FEASIBILITY_RESERVE_MONTHS}-month living reserve equals monthly expenses times ${FEASIBILITY_RESERVE_MONTHS}. Strong Position means liquid assets minus the cost stack are at least that reserve. Moderate Position means liquid plus semi-liquid assets, minus debts, cover the cost stack plus the reserve, but liquid assets alone do not. Otherwise the page shows a shortfall.`,
    ],
    rules: [
      { text: `The ${formatProgramDollars(TEA_INVESTMENT_THRESHOLD)} dollar TEA amount and the ${formatProgramDollars(NON_TEA_INVESTMENT_THRESHOLD)} dollar standard amount are the capital minimums used across this site. They do not include filing, legal, or administration fees.`, label: 'USCIS: About the EB-5 visa classification', href: eb5About },
      { text: 'The fee lines are planning allowances inside this calculator, not a USCIS invoice. The filing-cost article separates attorney, USCIS, and regional center charges from the investment.', label: 'I-526E filing cost', href: '/research/investment/i526e-filing-cost' },
    ],
    example: {
      intro: `TEA selected, liquid assets 1,200,000 dollars, semi-liquid assets 0, debts 0, monthly expenses ${formatProgramDollars(FEASIBILITY_DEFAULT_MONTHLY_EXPENSES)}.`,
      inputs: ['Investment type: TEA', 'Liquid assets: 1200000', 'Semi-liquid assets: 0', 'Debts: 0', 'Monthly expenses: 5000'],
      result: 'Cost stack is 948,660 dollars and the 24-month reserve is 120,000 dollars. Liquid assets cover the stack with 251,340 dollars left, which is 50.3 months of the entered expenses. The label is Strong Position.',
    },
    faqs: [
      { question: 'Does the feasibility calculator include attorney and USCIS fees?', answer: `Yes. It adds ${formatProgramDollars(FEASIBILITY_ATTORNEY_ALLOWANCE)}, ${formatProgramDollars(FEASIBILITY_USCIS_ALLOWANCE)}, ${formatProgramDollars(FEASIBILITY_ADMIN_ALLOWANCE)}, ${formatProgramDollars(FEASIBILITY_DOCS_ALLOWANCE)}, and ${formatProgramDollars(FEASIBILITY_RELOCATION_ALLOWANCE)} on top of the ${formatProgramDollars(TEA_INVESTMENT_THRESHOLD)} or ${formatProgramDollars(NON_TEA_INVESTMENT_THRESHOLD)} investment. Those add-ons are planning figures stored in this calculator. They are not a quote from USCIS.` },
      { question: 'Which entries change the position label?', answer: `Liquid assets, semi-liquid assets, debts, monthly expenses, and the TEA or standard choice. The reserve is monthly expenses times ${FEASIBILITY_RESERVE_MONTHS}.` },
      { question: 'What is a semi-liquid asset in this tool?', answer: 'The form treats retirement accounts and real estate as semi-liquid. The note on the page says those assets take time to reach and can face tax or penalties. They count toward Moderate Position, not toward the liquid cushion test.' },
      { question: 'Is a Strong Position the same as EB-5 eligibility?', answer: 'No. The banner on the tool says the result is preliminary and is not legal or financial advice. Source of funds, project choice, and filing rules are separate from this cash test.' },
    ],
    related: [
      { href: '/tools/source-of-funds-calculator', label: 'EB-5 source of funds calculator' },
      { href: '/tools/eb5-source-of-funds-checklist', label: 'EB-5 source of funds checklist' },
      { href: '/tools/tuition-calculator', label: 'Tuition savings calculator' },
    ],
    learn: [
      { href: '/research/investment/what-to-know-before-investing-in-eb5', label: 'What to know before an EB-5 investment' },
      { href: '/research/eb5-economic-calculus-investment-cost', label: 'What the 800,000 dollar investment covers' },
      { href: '/pathways/eb5-source-of-funds', label: 'EB-5 source of funds pathway' },
    ],
  },
  lottery: {
    toolName: 'H-1B lottery odds calculator',
    h1: 'H-1B Lottery Odds Calculator',
    category: 'UtilitiesApplication',
    steps: [
      { title: 'Select a job title', body: 'Search the job list and pick a title. The tool stores the SOC code on that row. The odds table itself does not change with the title.' },
      { title: 'Select a state and a county', body: 'Both fields are required before the table appears. The county list depends on the state you pick.' },
      { title: 'Read the four rows', body: 'Each row shows a salary band, a ticket count from 1 to 4, and a selection percent. The job, state, and county do not change those percents. Reset clears the job, state, and county.' },
    ],
    method: [
      'The model starts from 343,000 registrations and keeps 75 percent of that figure, which is 257,250. It then splits those registrations into wage levels at 40 percent, 42 percent, 11 percent, and 7 percent. Level 1 gets 1 ticket, level 2 gets 2, level 3 gets 3, and level 4 gets 4.',
      'Selections needed are fixed at 120,141. The chance factor is that number divided by total tickets. The displayed percent for a level is 1 minus (1 minus that factor) raised to the ticket count, shown to one decimal. Salary bands on the table start at 64,000 dollars and step by 14,000 dollars. They are labels in the tool, not a wage lookup for the county you chose.',
    ],
    rules: [
      { text: 'The registration base, the 75 percent projection, the 120,141 selections, and the 1 to 4 ticket weights are assumptions inside this calculator. They are not copied from a USCIS table on this site.', label: 'H-1B to EB-5 pathway', href: '/pathways/h1b-to-green-card' },
      { text: 'The site discusses H-1B as employer-tied status and EB-5 as a separate immigrant category. This odds table does not file a registration.', label: 'H-1B alternatives: O-1, EB-1, and EB-5', href: '/research/best-alternative-to-h1b-o1-eb1-eb5' },
    ],
    example: {
      intro: 'Any complete job, state, and county selection produces the same four percents, because the table does not use the SOC wage or the county wage level.',
      inputs: ['Job title: any title in the list', 'State: any state', 'County: any county in that state'],
      result: 'The rows read 25.2 percent (1 ticket), 44.1 percent (2 tickets), 58.2 percent (3 tickets), and 68.8 percent (4 tickets).',
    },
    faqs: [
      { question: 'Does the county change the H-1B odds?', answer: 'No. State and county must be filled before the table renders, but the percent math does not read the county wage. The four percents stay the same for every complete selection.' },
      { question: 'What do the salary bands mean?', answer: 'They are fixed labels. Level 1 starts at 64,000 dollars and each next band adds 14,000 dollars. They are not the prevailing wage for the job you picked.' },
      { question: 'Why does a low percent show an extra warning?', answer: 'If the selected job has a level whose displayed odds are under 30 percent, the page flags that row. With the current model, level 1 is 25.2 percent, so a level 1 job triggers that flag.' },
      { question: 'Is this an official USCIS lottery result?', answer: 'No. It is a projection from the constants above. A real registration is filed by an employer with USCIS, and selection is not guaranteed by this page.' },
    ],
    related: [
      { href: '/tools/opt-calculator', label: 'OPT calculator' },
      { href: '/tools/eb5-concurrent-filing-eligibility', label: 'EB-5 concurrent filing checker' },
      { href: '/tools/2026-eb5-investment-feasibility-calculator', label: 'EB-5 feasibility calculator' },
    ],
    learn: [
      { href: '/pathways/h1b-to-green-card', label: 'H-1B to green card via EB-5' },
      { href: '/research/best-alternative-to-h1b-o1-eb1-eb5', label: 'O-1, EB-1, and EB-5 compared with H-1B' },
      { href: '/research/5-reasons-switch-h1b-to-eb5', label: 'Reasons H-1B holders look at EB-5' },
    ],
  },
  opt: {
    toolName: 'OPT calculator',
    h1: 'OPT Calculator - F-1 Application and EAD Timelines',
    category: 'UtilitiesApplication',
    steps: [
      { title: 'Set the level of study', body: 'The level list is on the form. The date math uses the program end date, not the degree name.' },
      { title: 'Enter the I-20 program end date', body: 'Use the program end date from the I-20. The calculator treats that date as a UTC calendar day.' },
      { title: 'Read the apply window and the start window', body: 'The page shows the earliest ISSO date, the last day for USCIS to receive the filing, the earliest OPT start, and the latest OPT start.' },
    ],
    method: [
      'From the program end date, the tool subtracts 90 days for the earliest application date and adds 60 days for the latest day USCIS can receive the application. The earliest OPT start is the day after the program end date. The latest OPT start is 60 days after the program end date.',
      'If you also enter requested EAD dates, the tool checks that a requested start falls on or between the earliest and latest start dates. Dates outside that window produce an on-screen error instead of an end date.',
    ],
    rules: [
      { text: 'The 90-day and 60-day windows are the offsets this calculator applies to the program end date. The site already points readers to the USCIS OPT page for the underlying student rules.', label: 'USCIS: Optional Practical Training for F-1 students', href: optPage },
      { text: 'The F-1 to EB-5 article on this site discusses OPT as a 12-month period, with a further STEM extension in a separate status discussion.', label: 'F-1 to EB-5 green card guide', href: '/research/f1-students/f1-to-eb5-green-card' },
    ],
    example: {
      intro: 'Program end date June 1, 2026. Level of study can be any option. It does not change these four dates.',
      inputs: ['Program end date: 2026-06-01'],
      result: 'Earliest date to apply is 03/03/2026. The last day for USCIS to receive the application is 07/31/2026. Earliest OPT start is 06/02/2026. Latest OPT start is 07/31/2026.',
    },
    faqs: [
      { question: 'Does the degree level change the OPT dates?', answer: 'No. The select list is on the page, but the apply and start dates are calculated only from the program end date you type.' },
      { question: 'Why is the earliest apply date 90 days before the end date?', answer: 'That is the offset coded in this calculator. For a June 1, 2026 end date, 90 days earlier is March 3, 2026.' },
      { question: 'What if the requested start date is outside the window?', answer: 'The tool shows an error and names the earliest and latest start dates. It does not invent an end date for a start outside that range.' },
      { question: 'Does this calculator file Form I-765?', answer: 'No. It only prints the date window. Filing is still done with the school ISSO and with USCIS.' },
    ],
    related: [
      { href: '/tools/tuition-calculator', label: 'Tuition savings calculator' },
      { href: '/tools/h1b-lottery-odds-calculator', label: 'H-1B lottery odds calculator' },
      { href: '/tools/eb5-concurrent-filing-eligibility', label: 'EB-5 concurrent filing checker' },
    ],
    learn: [
      { href: '/research/f1-students/f1-to-eb5-green-card', label: 'F-1 to EB-5 green card guide' },
      { href: '/pathways/f1-to-eb5-self-sponsored-green-card', label: 'F-1 student EB-5 pathway' },
    ],
  },
  tuition: {
    toolName: 'tuition savings calculator',
    h1: 'Tuition Savings Calculator - F-1 vs In-State 4-Year Costs',
    category: 'FinanceApplication',
    steps: [
      { title: 'Open the university list', body: 'The list is the eight schools stored in the tool. There is no free-text tuition field.' },
      { title: 'Select one school', body: 'The page loads that school international annual figure and its in-state annual figure.' },
      { title: 'Read the four-year gap', body: 'Annual savings are the international rate minus the in-state rate. The four-year figure multiplies that gap by four.' },
    ],
    method: [
      'Each school has two stored annual amounts, labeled in the tool as 2024-2025 international and in-state tuition. Annual savings equal international minus in-state. Total savings equal annual savings times four.',
      'The footnote on the calculator says the figures are estimates, can vary by college and credit load, and do not add room and board unless those charges are already inside the stored tuition number.',
    ],
    rules: [
      { text: 'The dollar amounts are the pairs stored in this calculator, not a live bursar feed. The page footnote states the 2024-2025 academic year basis.', label: 'Tuition calculator footnote on this page', href: '/tools/tuition-calculator' },
      { text: 'The education article on this site discusses in-state tuition as one reason families compare EB-5 with continued F-1 status.', label: 'EB-5 and in-state tuition', href: '/research/how-eb5-visa-transforms-us-education-experience' },
    ],
    example: {
      intro: 'Select UCLA. No other inputs are required.',
      inputs: ['University: UCLA'],
      result: 'International annual tuition is 48,315 dollars. In-state annual tuition is 13,804 dollars. Annual savings are 34,511 dollars. Four-year savings are 138,044 dollars.',
    },
    faqs: [
      { question: 'Can I type my own tuition amount?', answer: 'No. The tool only calculates the eight schools in the menu. A school that is not listed has no result on this page.' },
      { question: 'Does the four-year total include housing?', answer: 'Only if housing is already inside the stored tuition number. The footnote says room, board, and other fees are excluded unless they are part of that tuition figure.' },
      { question: 'Does a lower in-state number mean the student already has residency?', answer: 'No. The subtraction shows the gap between the two published-style rates in the tool. It does not decide whether a student qualifies for the resident rate.' },
      { question: 'Are these rates the current bursar bill?', answer: 'The tool labels them as 2024-2025 estimates. The school can change tuition after that year. Use the school bill for a live number.' },
    ],
    related: [
      { href: '/tools/opt-calculator', label: 'OPT calculator' },
      { href: '/tools/2026-eb5-investment-feasibility-calculator', label: 'EB-5 feasibility calculator' },
      { href: '/tools/source-of-funds-calculator', label: 'EB-5 source of funds calculator' },
    ],
    learn: [
      { href: '/pathways/f1-to-eb5-self-sponsored-green-card', label: 'F-1 student EB-5 pathway' },
      { href: '/research/how-eb5-visa-transforms-us-education-experience', label: 'EB-5 and tuition rates' },
    ],
  },
  funds: {
    toolName: 'EB-5 source of funds calculator',
    h1: 'EB-5 Source of Funds Calculator - Gift, Loan, Salary, Crypto Paths',
    category: 'FinanceApplication',
    steps: [
      { title: 'Set the tax status', body: 'Choose non-resident or resident. That choice sets the brokerage gain rate at 30 percent or 20 percent.' },
      { title: 'Enter the asset amounts', body: 'Brokerage needs a cost basis and a current value. IRA or 401(k) is one balance. HELOC is one amount. Leave a pair blank if you are not testing it.' },
      { title: 'Open the results step', body: 'The page names the path with the lowest estimated cost among the paths you filled in, and it shows that dollar cost.' },
    ],
    method: [
      'Brokerage cost is the gain, current value minus cost basis, times 30 percent for non-resident status or 20 percent for resident status. If the gain is zero or negative, brokerage cost is zero. A missing basis or value leaves brokerage out of the comparison.',
      'An IRA or 401(k) balance is multiplied by 0.35, which is the tool 10 percent penalty plus 25 percent tax estimate. A HELOC amount is multiplied by 0.085, and the page calls that an annual interest cost. The recommended path is the lowest of the costs you actually entered.',
    ],
    rules: [
      { text: 'Lawful source of EB-5 capital is the requirement described in the Policy Manual chapter this site already cites. This calculator estimates tax drag. It does not document the source.', label: 'USCIS Policy Manual, Volume 6, Part G, Chapter 2', href: sofPolicy },
      { text: 'The funding article on this site covers gifts, loans, and other paths USCIS reviews. The 30 percent, 20 percent, 35 percent, and 8.5 percent rates are estimates stored in this calculator.', label: 'Ways to fund EB-5', href: '/research/ways-to-fund-eb5-investment-2026' },
    ],
    example: {
      intro: 'Non-resident status, brokerage cost basis 500,000 dollars, brokerage current value 800,000 dollars, IRA and HELOC left blank.',
      inputs: ['Tax status: non-resident', 'Brokerage cost basis: 500000', 'Brokerage current value: 800000'],
      result: 'Gain is 300,000 dollars. At 30 percent, brokerage cost is 90,000 dollars. The recommended path is Brokerage, because it is the only cost in the comparison.',
    },
    faqs: [
      { question: 'Does the target funding box change the tax estimate?', answer: 'The default target is 800,000 dollars, matching the TEA capital amount used on this site. The brokerage, IRA, and HELOC costs are computed from the asset fields, not from that target.' },
      { question: 'What rate does the tool use for a retirement withdrawal?', answer: 'It multiplies the balance by 35 percent. The on-screen text describes that as a 10 percent early withdrawal penalty plus an income-tax estimate.' },
      { question: 'What does the HELOC line represent?', answer: 'It is 8.5 percent of the amount you enter, shown as estimated annual interest. The result text says that interest is not deductible for an EB-5 investment in this tool explanation.' },
      { question: 'Will the lowest cost path satisfy USCIS?', answer: 'No. A lower estimated tax cost is not a source-of-funds finding. The Policy Manual chapter linked above is about proving where the capital came from.' },
    ],
    related: [
      { href: '/tools/eb5-source-of-funds-checklist', label: 'EB-5 source of funds checklist' },
      { href: '/tools/2026-eb5-investment-feasibility-calculator', label: 'EB-5 feasibility calculator' },
      { href: '/tools/grandfathering-countdown', label: 'EB-5 grandfathering countdown' },
    ],
    learn: [
      { href: '/research/ways-to-fund-eb5-investment-2026', label: 'Ways to fund an EB-5 investment' },
      { href: '/pathways/eb5-source-of-funds', label: 'EB-5 source of funds pathway' },
      { href: '/research/eb5-cryptocurrency-source-of-funds', label: 'EB-5 cryptocurrency source of funds' },
    ],
  },
  checklist: {
    toolName: 'EB-5 source of funds checklist',
    h1: 'EB-5 Source of Funds Checklist - Personalized I-526E Document List',
    category: 'UtilitiesApplication',
    steps: [
      { title: 'Pick one capital source', body: 'The four buttons are salary and savings, gifted funds, property sale or loan, and equity and investments. There is no dollar field.' },
      { title: 'Read the document list', body: 'The page replaces the buttons with the list stored for that source. Each list is five document types.' },
      { title: 'Reset to try another source', body: 'Reset returns the four buttons. The tool does not combine two sources into one list.' },
    ],
    method: null,
    rules: [],
    example: {
      intro: 'Choose Gifted Funds. The page does not ask for an amount.',
      inputs: ['Primary source: Gifted Funds'],
      result: 'The list shows a signed gift letter, proof of the lawful source of the donor, a wire record from donor to investor, the donor tax returns for the last five years, and proof of relationship.',
    },
    faqs: [
      { question: 'Does the checklist calculate whether the funds are enough?', answer: 'No. It only shows the document list for the button you press. Dollar tests are on the feasibility calculator and the source of funds calculator.' },
      { question: 'Can I select two sources at once?', answer: 'No. One button is active at a time. Reset and pick the other source to see its list. A petition that uses two sources needs both document sets, which this page does not merge.' },
      { question: 'Where do the five gifted-fund items come from?', answer: 'They are the lines stored for the Gifted Funds button: gift letter, donor source, wire record, donor tax returns, and proof of relationship. The page says the list is a starting framework, not a complete exhibit index.' },
      { question: 'Does a complete list mean USCIS will accept the funds?', answer: 'No. The note under the list says requirements vary and that counsel should confirm the file before I-526E is filed. The Policy Manual chapter on this site is the eligibility discussion, not this button set.' },
    ],
    related: [
      { href: '/tools/source-of-funds-calculator', label: 'EB-5 source of funds calculator' },
      { href: '/tools/2026-eb5-investment-feasibility-calculator', label: 'EB-5 feasibility calculator' },
      { href: '/tools/eb5-regional-center-scorecard', label: 'EB-5 regional center scorecard' },
    ],
    learn: [
      { href: '/research/ways-to-fund-eb5-investment-2026', label: 'Ways to fund an EB-5 investment' },
      { href: '/pathways/eb5-gifted-funds', label: 'EB-5 with gifted funds' },
      { href: '/faq/parents-gift-eb5-investment-funds', label: 'FAQ: parents gifting EB-5 funds' },
    ],
  },
  scorecard: {
    toolName: 'EB-5 regional center scorecard',
    h1: 'EB-5 Regional Center Scorecard - Trust Score Due Diligence',
    category: 'UtilitiesApplication',
    steps: [
      { title: 'Enter years in operation and I-829 approvals', body: 'Both are numbers. Years are capped at 100 in the math. Approvals are capped at 100,000.' },
      { title: 'Set violations and defaults', body: 'Each menu has three stored choices: none, a middle level, or a major level. They start on none.' },
      { title: 'Calculate the trust score', body: 'The page shows a score from 0 to 100 and a tier label. The note under the score says it is an estimate from the numbers you typed.' },
    ],
    method: [
      'The score starts at 50. Each year in operation adds 2 points. Approvals add 20 points if the count is above 500. Otherwise approvals are divided by 25 and that amount is added.',
      'A minor violation subtracts 15. A major violation subtracts 40. A minor default history subtracts 20. A major default history subtracts 50. The result is rounded and held between 0 and 100. 85 or more is Tier 1. 60 to 84 is Tier 2. Under 60 is Tier 3.',
    ],
    rules: [
      { text: 'These weights are the formula stored in this scorecard. USCIS does not publish this 0 to 100 score. The tool note says a high score is not a return promise.', label: 'Scorecard result note on this page', href: '/tools/eb5-regional-center-scorecard' },
      { text: 'Job creation and regional center review are discussed in the Policy Manual chapter this site already cites, which is separate from this point model.', label: 'USCIS Policy Manual, Volume 6, Part G, Chapter 2', href: sofPolicy },
      { text: 'The due diligence article lists questions to ask before investing in a rural project. Use that list alongside any score.', label: '19 rural EB-5 due diligence questions', href: '/research/19-questions-rural-eb5-project-due-diligence' },
    ],
    example: {
      intro: 'Ten years in operation, 600 I-829 approvals, no violations, and no defaults.',
      inputs: ['Years: 10', 'I-829 approvals: 600', 'Violations: None / Clean Record', 'Defaults: the menu value that starts at none'],
      result: 'The score is 90 out of 100, labeled Tier 1: Institutional Grade. The math is 50, plus 20 for the years, plus 20 because approvals are above 500.',
    },
    faqs: [
      { question: 'Is the trust score a USCIS grade?', answer: 'No. It is a weighted total of the four fields on this form. The result text says it is an estimate from self-reported institutional data.' },
      { question: 'What happens above 500 approvals?', answer: 'The formula stops adding a fraction and adds a flat 20 points. 600 approvals and 5,000 approvals add the same 20 points from that line.' },
      { question: 'How many points does a major violation remove?', answer: 'The major violation choice subtracts 40. The minor choice subtracts 15. None subtracts nothing. A major default history subtracts 50.' },
      { question: 'Can the score go below zero?', answer: 'The formula floors the result at 0 and caps it at 100 after rounding. A heavy penalty on a short operating history can land on 0.' },
    ],
    related: [
      { href: '/tools/2026-eb5-investment-feasibility-calculator', label: 'EB-5 feasibility calculator' },
      { href: '/tools/eb5-source-of-funds-checklist', label: 'EB-5 source of funds checklist' },
      { href: '/tools/source-of-funds-calculator', label: 'EB-5 source of funds calculator' },
    ],
    learn: [
      { href: '/research/choosing-rural-eb5-regional-center-guide', label: 'How to choose a rural EB-5 regional center' },
      { href: '/research/19-questions-rural-eb5-project-due-diligence', label: '19 due diligence questions' },
      { href: '/pathways/eb5-project-due-diligence', label: 'EB-5 project due diligence pathway' },
    ],
  },
  concurrent: {
    toolName: 'EB-5 concurrent filing checker',
    h1: 'EB-5 Concurrent Filing Eligibility Checker - I-526E and I-485 Timing',
    category: 'UtilitiesApplication',
    steps: [
      { title: 'Mark whether you are inside or outside the United States', body: 'The two buttons are the location field. Outside the United States always takes the consular result.' },
      { title: 'Select country of birth and project category', body: 'Country is Rest of World or China or India. Category is Rural / Reserved or Urban / Unreserved.' },
      { title: 'Run the check', body: 'All three fields are required. The result title is Consular Processing, You Are Eligible, or Retrogression Warning.' },
    ],
    method: [
      'If the location is outside the United States, the result is Consular Processing, regardless of country or category. The message says concurrent filing is described here as a benefit for people already in the United States.',
      'If the location is inside the United States, the result is You Are Eligible when the category is Rural / Reserved or the country is Rest of World. China or India combined with Urban / Unreserved returns Retrogression Warning. The eligible message mentions filing I-526E and I-485 together and then EAD and Advance Parole.',
    ],
    rules: [
      { text: 'The three results are the branches in this checker. They are not a USCIS eligibility determination.', label: 'EB-5 concurrent filing pathway', href: '/pathways/eb5-concurrent-filing' },
      { text: 'The concurrent filing page on this site points to USCIS processing times for readers who want the agency clock, which this checker does not query.', label: 'USCIS processing times', href: processingTimes },
      { text: 'Visa availability for China and India is published in the Visa Bulletin. This checker uses a yes-or-no country field, not a live chart.', label: 'Visa Bulletin', href: visaBulletin },
    ],
    example: {
      intro: 'Inside the United States, Rest of World, and Rural / Reserved.',
      inputs: ['Location: Inside U.S.', 'Country of birth: Rest of World (Current)', 'Project category: Rural / Reserved (Priority)'],
      result: 'The title is You Are Eligible. The message says I-526E and I-485 can be filed together and mentions the EAD and Advance Parole.',
    },
    faqs: [
      { question: 'What if I am outside the United States?', answer: 'The checker returns Consular Processing for that button, even if the country is Rest of World and the project is reserved. It tells you the path runs through the National Visa Center.' },
      { question: 'When does China or India get the eligible result?', answer: 'Inside the United States, China or India with Rural / Reserved returns You Are Eligible. The same country with Urban / Unreserved returns Retrogression Warning.' },
      { question: 'Does the checker look up the Visa Bulletin?', answer: 'No. It uses the country menu and the category menu only. A current or backlogged date on a later bulletin will not change the result until those menus change.' },
      { question: 'Does You Are Eligible mean USCIS will accept the I-485?', answer: 'No. It is the label for that combination of buttons. Maintaining status, a current priority date, and a complete filing are separate from this page. The pending-green-card page USCIS publishes is linked from the site inflation article.' },
    ],
    related: [
      { href: '/tools/eb5-cspa-calculator', label: 'EB-5 CSPA age calculator' },
      { href: '/tools/grandfathering-countdown', label: 'EB-5 grandfathering countdown' },
      { href: '/tools/opt-calculator', label: 'OPT calculator' },
    ],
    learn: [
      { href: '/pathways/eb5-concurrent-filing', label: 'EB-5 concurrent filing pathway' },
      { href: '/research/j1-f1-h1b-eb5-concurrent-filing', label: 'Concurrent filing for J-1, F-1, and H-1B' },
      { href: '/faq/eb5-concurrent-filing-work-permit-timeline', label: 'FAQ: concurrent filing and the EAD' },
    ],
  },
  grandfathering: {
    toolName: 'EB-5 grandfathering countdown',
    h1: 'EB-5 Grandfathering & 2027 Sunset Countdown',
    category: 'UtilitiesApplication',
    steps: [
      { title: 'Read the status line', body: `The line states that the ${formatProgramDate(GRANDFATHERING_FILING_DEADLINE)} grandfathering filing date has passed. There is no date field to type.` },
      { title: 'Read the four clock units', body: `The clock counts down to the end of ${formatProgramDate(RC_PROGRAM_AUTHORIZED_THROUGH)} in US Eastern time. It shows days, hours, minutes, and seconds.` },
      { title: 'Read the filing distinction', body: `Petitions properly filed on or before ${formatProgramDate(GRANDFATHERING_FILING_DEADLINE)} have grandfathering protection. Petitions filed later can still be filed while the program is authorized, but without that protection.` },
    ],
    method: [
      `The clock target is the end of ${formatProgramDate(RC_PROGRAM_AUTHORIZED_THROUGH)}, at 11:59:59 p.m. US Eastern. The page subtracts the current time from that instant and splits the remainder into days, hours, minutes, and seconds.`,
      `The ${formatProgramDate(GRANDFATHERING_FILING_DEADLINE)} date is a status statement, not the clock target. Milestone cards are labels. They are not added into the clock.`,
    ],
    rules: [
      { text: `Petitions properly filed on or before ${formatProgramDate(GRANDFATHERING_FILING_DEADLINE)} have grandfathering protection. That date is the filing date used on this page and in the grandfathering article.`, label: 'EB-5 grandfathering deadline article', href: '/research/eb5-grandfathering-2026-2027-deadlines' },
      { text: 'The same site distinguishes the grandfathering filing date from the January 1, 2027 investment-amount adjustment.', label: 'EB-5 inflation adjustment', href: '/research/eb5-inflation-adjustment-f1-h1b' },
      { text: 'The EB-5 classification overview USCIS publishes is the program page already cited in the inflation article.', label: 'USCIS: About the EB-5 visa classification', href: eb5About },
    ],
    example: {
      intro: `There is no typed input. Open the page and read the Days unit. The clock target is the end of ${formatProgramDate(RC_PROGRAM_AUTHORIZED_THROUGH)} in US Eastern time.`,
      inputs: ['No form fields. The input is the current time.'],
      result: `Days is the whole days until that instant. Hours stay below 24. Minutes and seconds stay below 60. The status line states that ${formatProgramDate(GRANDFATHERING_FILING_DEADLINE)} has passed.`,
    },
    faqs: [
      { question: 'Can I enter a different date?', answer: `No. The grandfathering filing date is ${formatProgramDate(GRANDFATHERING_FILING_DEADLINE)}. The clock target is the end of ${formatProgramDate(RC_PROGRAM_AUTHORIZED_THROUGH)} in US Eastern time.` },
      { question: 'What is the difference between the two dates?', answer: `Petitions properly filed on or before ${formatProgramDate(GRANDFATHERING_FILING_DEADLINE)} have grandfathering protection. Petitions filed later can still be filed while the program is authorized, but without that protection.` },
      { question: 'Do the milestone months get subtracted from the days?', answer: `No. The cards are separate text. The clock is only the time until the end of ${formatProgramDate(RC_PROGRAM_AUTHORIZED_THROUGH)}.` },
      { question: 'Is the clock a filing confirmation?', answer: 'No. It counts time. Filing Form I-526E, source of funds, and project choice are the steps listed under the clock, not something the clock completes.' },
    ],
    related: [
      { href: '/tools/eb5-concurrent-filing-eligibility', label: 'EB-5 concurrent filing checker' },
      { href: '/tools/2026-eb5-investment-feasibility-calculator', label: 'EB-5 feasibility calculator' },
      { href: '/tools/eb5-cspa-calculator', label: 'EB-5 CSPA age calculator' },
    ],
    learn: [
      { href: '/research/eb5-grandfathering-2026-2027-deadlines', label: 'EB-5 grandfathering deadline' },
      { href: '/research/eb5-inflation-adjustment-f1-h1b', label: 'EB-5 inflation adjustment' },
    ],
  },
} satisfies Record<string, ToolGuideData>;
