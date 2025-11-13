import PageShell from '../components/layout/PageShell';

export default function TermsPage() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: January 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using the Maathai Innovation Catalyst (MIC) platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.
            </p>
            <p className="text-gray-700">
              MIC is a platform connecting innovators developing sustainable wood alternatives with investors and job seekers. We facilitate connections but do not provide investment advice or guarantee investment outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts and Roles</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Account Types</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>User:</strong> Can submit projects, apply for jobs, and browse approved projects</li>
              <li><strong>Investor:</strong> Must apply and be approved by admin. Can invest in projects and access deal flow</li>
              <li><strong>Admin:</strong> Platform administrators with full access and approval rights</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Account Requirements</h3>
            <p className="text-gray-700 mb-2">You must:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Not share your account with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Platform Services</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 For Innovators</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Submit project proposals for sustainable wood alternatives</li>
              <li>Projects are subject to admin review and approval</li>
              <li>Connect with potential investors</li>
              <li>Post job openings for approved projects</li>
              <li>Receive and manage applications</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 For Investors</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Must complete investor application and receive admin approval</li>
              <li>Browse vetted sustainable projects</li>
              <li>Make investment decisions independently</li>
              <li>Track investment portfolio</li>
              <li>Communicate with project owners</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 For Job Seekers</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Browse job opportunities at sustainable startups</li>
              <li>Apply to positions with resume and cover letter</li>
              <li>Track application status</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Transaction Fees</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Platform Fee</h3>
            <p className="text-gray-700 mb-4">
              MIC charges a <strong>2% transaction fee</strong> on all successful investments made through the platform. This fee is automatically deducted when the investment is processed.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Payment Processing</h3>
            <p className="text-gray-700 mb-4">
              All payments are processed through secure third-party payment processors (Stripe). Additional payment processing fees may apply as per the payment processor's terms.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 No Refunds</h3>
            <p className="text-gray-700">
              Transaction fees are non-refundable. Investment decisions are final and cannot be reversed through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Investment Disclaimer</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-gray-800 font-semibold mb-2">IMPORTANT INVESTMENT NOTICE:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>MIC is a connection platform, NOT an investment advisor</li>
                <li>We do not provide investment advice or recommendations</li>
                <li>All investments carry risk, including total loss of capital</li>
                <li>Past performance does not guarantee future results</li>
                <li>You are solely responsible for your investment decisions</li>
                <li>Conduct your own due diligence before investing</li>
                <li>Consult with financial, legal, and tax advisors</li>
              </ul>
            </div>
            <p className="text-gray-700">
              MIC does not guarantee the success of any project, the accuracy of information provided by project owners, or the return on any investment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Responsibilities</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Content Accuracy</h3>
            <p className="text-gray-700 mb-4">
              You are responsible for ensuring all information you provide (project details, investor profiles, job postings) is accurate, complete, and not misleading.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Prohibited Activities</h3>
            <p className="text-gray-700 mb-2">You may not:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Engage in money laundering or illegal activities</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate intellectual property rights</li>
              <li>Attempt to manipulate or game the platform</li>
              <li>Use automated systems to access the platform</li>
              <li>Circumvent platform fees or payment systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Platform Content</h3>
            <p className="text-gray-700 mb-4">
              All platform design, code, logos, and content are owned by MIC and protected by copyright and trademark laws.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 User Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of content you submit (project descriptions, profiles, etc.). By submitting content, you grant MIC a non-exclusive, worldwide license to display, distribute, and promote your content on the platform.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Project Ideas</h3>
            <p className="text-gray-700">
              You are responsible for protecting your intellectual property. MIC is not liable for any unauthorized use of your ideas by other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data</h2>
            <p className="text-gray-700 mb-4">
              Your use of the platform is also governed by our Privacy Policy. We collect, use, and protect your data as described in that policy.
            </p>
            <p className="text-gray-700">
              By using MIC, you consent to the collection and use of your information as outlined in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-gray-800 font-semibold mb-2">DISCLAIMER:</p>
              <p className="text-gray-700">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MIC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR INVESTMENTS, ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              MIC's total liability to you for any claims arising from your use of the platform shall not exceed the fees you paid to MIC in the 12 months preceding the claim.
            </p>
            <p className="text-gray-700">
              We do not guarantee uninterrupted or error-free service and are not liable for any technical issues, data loss, or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold harmless MIC, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Your use of the platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Content you submit to the platform</li>
              <li>Investment decisions you make</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">11.1 By You</h3>
            <p className="text-gray-700 mb-4">
              You may terminate your account at any time by contacting us. Termination does not affect existing obligations or liabilities.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">11.2 By MIC</h3>
            <p className="text-gray-700 mb-2">
              We may suspend or terminate your account immediately if you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent activity</li>
              <li>Provide false information</li>
              <li>Harm other users or the platform</li>
              <li>Fail to pay required fees</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Dispute Resolution</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">12.1 Between Users</h3>
            <p className="text-gray-700 mb-4">
              Disputes between users (investors and project owners) must be resolved directly between the parties. MIC may provide communication tools but is not responsible for resolving disputes.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">12.2 With MIC</h3>
            <p className="text-gray-700 mb-4">
              Any disputes with MIC shall first be attempted to be resolved through good faith negotiation. If unresolved, disputes shall be subject to binding arbitration under the rules of [Arbitration Body] in [Jurisdiction].
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">12.3 Governing Law</h3>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              MIC reserves the right to modify these Terms at any time. We will notify users of material changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new Terms.
            </p>
            <p className="text-gray-700">
              It is your responsibility to review these Terms periodically for updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Miscellaneous</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">14.1 Entire Agreement</h3>
            <p className="text-gray-700 mb-4">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and MIC.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">14.2 Severability</h3>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full effect.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">14.3 No Waiver</h3>
            <p className="text-gray-700 mb-4">
              Failure to enforce any provision does not constitute a waiver of that provision.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">14.4 Assignment</h3>
            <p className="text-gray-700">
              You may not assign these Terms without our written consent. MIC may assign these Terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> legal@mic-platform.com</p>
              <p className="text-gray-700"><strong>Address:</strong> [Your Business Address]</p>
              <p className="text-gray-700"><strong>Phone:</strong> [Your Contact Number]</p>
            </div>
          </section>

          <section className="border-t pt-8 mt-8">
            <p className="text-gray-600 text-sm">
              By clicking "I Agree" or by using the MIC platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
