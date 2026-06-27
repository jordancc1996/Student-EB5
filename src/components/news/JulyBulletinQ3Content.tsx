import { getNewsArticle } from '@/data/newsArticles';
import NewsArticleShell from './NewsArticleShell';

const article = getNewsArticle('july-2026-visa-bulletin-eb5-q3-outlook')!;

const JulyBulletinQ3Content = () => (
  <NewsArticleShell article={article}>
              <p>
                The July 2026 Visa Bulletin provides critical insights into the current state of the EB-5 program by revealing significant shifts in visa availability and processing times. The unreserved category for India has reached its annual limit, and we believe it is of extreme importance for prospective investors to understand the complexities surrounding the reserved categories.
              </p>

              <h2>Unreserved Category is Exhausted</h2>
              <p>
                The 2026 annual limit for India's employment second preference and unreserved EB-5 categories has been met. This means no more visa numbers will be available for Indian applicants in these categories for the remainder of the fiscal year. Applicants with cases nearing finalization must wait until October, when the new fiscal year brings a fresh supply of visas.
              </p>
              <p>
                The reserved visa categories remain current, and we recommend Indian applicants, along with investors from all other countries, continue to file in the three reserved categories: rural, high unemployment, and infrastructure. Review the <a href="/research/policy/eb5-grandfathering-september-2026">grandfathering deadline analysis</a> and the <a href="/tools/grandfathering-countdown">EB-5 grandfathering countdown</a> as you plan timing.
              </p>

              <h2>The Importance of Current Priority Dates</h2>
              <p>
                A critical nuance in the EB-5 process is the distinction between filing an adjustment of status and receiving a conditional green card. While a current priority date allows for the filing of an adjustment of status concurrently with the I-526E petition, the priority date must also be current at the time the I-526E is approved. Otherwise, USCIS cannot adjudicate the adjustment, which would ultimately leave the applicant in a backlog.
              </p>
              <p>
                The I-526E petition functions similarly to the I-140. It does not confer status or benefits directly but grants USCIS the authority to adjudicate the adjustment of status once the priority date is current.
              </p>

              <h2>How to Read the Visa Bulletin</h2>
              <p>
                The Department of State publishes the official monthly Visa Bulletin. The July 2026 edition is available here:{' '}
                <a
                  href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-july-2026.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visa Bulletin for July 2026
                </a>
                .
              </p>
              <p>
                The Visa Bulletin reflects known demand based on reports from the National Visa Center and USCIS field offices. A current status indicates that number usage is not exceeding the available supply. However, this status does not guarantee that numbers will be available months or years later when a case is finally approved. The final action date listed in the Visa Bulletin during the month a case can be finalized governs the processing. What we do know for certain is that the unreserved EB-5 category for India is no longer current due to high demand.
              </p>

              <h2>Visa Supply and Carryover Dynamics</h2>
              <p>
                Unused family-sponsored visa numbers from prior fiscal years carry over to the employment-based categories. This fiscal year, over 186,000 numbers are available, a substantial increase driven by approximately 46,000 unused family-sponsored numbers from fiscal year 2025.
              </p>
              <p>
                The EB-5 Reform and Integrity Act dictates the allocation of these numbers: 68% to the unreserved category, 20% to rural, 10% to high unemployment, and 2% to infrastructure. Unused reserved numbers from the prior fiscal year carry over, resulting in over 20,000 total EB-5 visas available for this fiscal year.
              </p>

              <h2>Priority Processing and Future Outlook</h2>
              <p>
                The rural category received priority processing, which leads to faster I-526E approvals. However, this prioritization means the rural category is more likely to face a final action date sooner than the high unemployment category because petitions are being approved at a higher rate.
              </p>
              <p>
                It is also important to note that priority processing applies only to the I-526E petition and not to employment authorization document, advance parole, or adjustment of status processing.
              </p>

              <h2>Frequently Asked Questions</h2>
              <h3>What does the "U" mean for India Unreserved in the Visa Bulletin?</h3>
              <p>
                The "U" indicates that the annual limit for the category has been reached and no further visas are available for the remainder of the fiscal year.
              </p>

              <h3>Can I still file an EB-5 petition if my country’s unreserved category is unavailable?</h3>
              <p>
                Yes. The unavailability of the unreserved category does not affect the reserved categories (rural, high unemployment, and infrastructure). Investors from all countries can continue to file in these categories.
              </p>

              <h3>Does a current priority date mean I will get my green card immediately upon I-526E approval?</h3>
              <p>
                No. Your priority date must be current at the time your I-526E is approved for USCIS to adjudicate your adjustment of status. If the category retrogresses before approval, you will be placed in a backlog.
              </p>
  </NewsArticleShell>
);

export default JulyBulletinQ3Content;
