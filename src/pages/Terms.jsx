import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'48px 24px' }}>
      <Link to="/" style={{ fontSize:13, color:'var(--ink-3)',
        display:'inline-flex', alignItems:'center', gap:4, marginBottom:32 }}>
        ← Back
      </Link>

      <div style={{ fontFamily:'var(--font-display)', fontSize:28,
        fontWeight:400, marginBottom:8, color:'var(--ink)' }}>
        reviewz<span style={{ color:'#1D9E75' }}>health</span>
      </div>

      <h1 style={{ fontSize:22, fontWeight:500, marginBottom:4, color:'var(--ink)' }}>
        Terms of Service
      </h1>
      <p style={{ fontSize:13, color:'var(--ink-3)', marginBottom:40 }}>
        Last updated: March 21, 2026
      </p>

      {[
        {
          title: '1. Acceptance of terms',
          body: `By creating an account and using reviewzhealth, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the service. These terms apply to all users, including owners and managers.`,
        },
        {
          title: '2. Description of service',
          body: `reviewzhealth is a software-as-a-service platform that helps restaurants and multi-location businesses monitor customer reviews, generate AI-drafted responses, track review health metrics, and manage team access across multiple review platforms. The service is provided by Greenhalgh Holdings LLC, based in Orem, Utah.`,
        },
        {
          title: '3. Subscription and billing',
          body: `reviewzhealth charges a monthly subscription fee based on the number of active locations on your account. Billing is per location per month according to the pricing tier applicable to your location count. Your subscription renews automatically each month. You may cancel at any time and your access will continue until the end of the current billing period. No refunds are issued for partial months.`,
        },
        {
          title: '4. Free trial',
          body: `New accounts may be eligible for a free trial period as offered by reviewzhealth. During the trial, full access to the service is provided at no charge. At the end of the trial period, your account will automatically convert to a paid subscription unless you cancel before the trial ends. A valid payment method is required to start a trial.`,
        },
        {
          title: '5. Acceptable use',
          body: `You agree to use reviewzhealth only for lawful purposes and in accordance with these terms. You may not use the service to post false or misleading reviews, manipulate review platforms in violation of their terms of service, harass or harm customers or competitors, or attempt to reverse engineer or exploit the platform. reviewzhealth reserves the right to suspend or terminate accounts that violate these terms.`,
        },
        {
          title: '6. Google Business Profile integration',
          body: `reviewzhealth integrates with Google Business Profile via Google's official API. By connecting your Google Business Profile, you authorize reviewzhealth to read your business reviews and post owner responses on your behalf. You retain full ownership and control of your Google Business Profile. You may disconnect your Google account at any time from the Settings page.`,
        },
        {
          title: '7. AI-generated content',
          body: `reviewzhealth uses artificial intelligence to generate draft responses to customer reviews. These drafts are suggestions only — you are responsible for reviewing, editing, and approving any response before it is posted. reviewzhealth does not guarantee the accuracy, appropriateness, or effectiveness of AI-generated content. You are solely responsible for any content posted to review platforms on your behalf.`,
        },
        {
          title: '8. Data and privacy',
          body: `reviewzhealth collects and stores your business profile information, review data, and account preferences in order to provide the service. We access only publicly visible review data and information you explicitly authorize through connected platform APIs. Your data is never sold to third parties. For full details on how we handle your data, please contact nathan@reviewzhealth.com.`,
        },
        {
          title: '9. Team access',
          body: `As an account owner, you may invite team members to access your reviewzhealth account. You are responsible for all activity that occurs under your account, including activity by invited team members. You should promptly remove access for any team members who are no longer authorized to use the service.`,
        },
        {
          title: '10. Service availability',
          body: `reviewzhealth aims to provide a reliable service but does not guarantee uninterrupted availability. We may perform maintenance, updates, or experience downtime beyond our control. reviewzhealth is not liable for any losses resulting from service interruptions.`,
        },
        {
          title: '11. Limitation of liability',
          body: `To the maximum extent permitted by law, Greenhalgh Holdings LLC's total liability to you for any claims arising from your use of reviewzhealth shall not exceed the total amount you paid for the service in the 30 days preceding the claim. reviewzhealth is not liable for indirect, incidental, or consequential damages of any kind.`,
        },
        {
          title: '12. Changes to terms',
          body: `reviewzhealth may update these terms from time to time. We will notify you of significant changes by email or by displaying a notice in the application. Continued use of the service after changes are posted constitutes acceptance of the updated terms.`,
        },
        {
          title: '13. Governing law',
          body: `These terms are governed by the laws of the State of Utah, United States. Any disputes arising from these terms shall be resolved in the courts of Utah County, Utah.`,
        },
        {
          title: '14. Contact',
          body: `If you have questions about these terms, please contact us at nathan@reviewzhealth.com.`,
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom:28 }}>
          <h2 style={{ fontSize:15, fontWeight:500, color:'var(--ink)', marginBottom:8 }}>
            {section.title}
          </h2>
          <p style={{ fontSize:14, color:'var(--ink-2)', lineHeight:1.8 }}>
            {section.body}
          </p>
        </div>
      ))}

      <div style={{
        marginTop:40, paddingTop:24,
        borderTop:'1px solid var(--border)',
        fontSize:13, color:'var(--ink-3)',
      }}>
        Greenhalgh Holdings LLC · Orem, Utah · nathan@reviewzhealth.com
      </div>
    </div>
  );
}
