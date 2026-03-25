import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
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
        Privacy Policy
      </h1>
      <p style={{ fontSize:13, color:'var(--ink-3)', marginBottom:40 }}>
        Last updated: March 25, 2026
      </p>

      {[
        {
          title: '1. Overview',
          body: `Greenhalgh Holdings LLC ("reviewzhealth", "we", "us", or "our") operates reviewzhealth.com. This Privacy Policy explains how we collect, use, and protect your information when you use our service. By using reviewzhealth, you agree to the collection and use of information in accordance with this policy.`,
        },
        {
          title: '2. Information we collect',
          body: `When you sign in with Google, we collect your name, email address, and profile photo from your Google account. When you connect your Google Business Profile, we access your business location information, customer reviews, and business profile data through Google's authorized APIs. We also collect usage data such as how you interact with the dashboard, which reviews you respond to, and which features you use.`,
        },
        {
          title: '3. How we use your information',
          body: `We use your information solely to provide the reviewzhealth service. Specifically we use it to display your business reviews in the dashboard, generate AI-drafted responses to your reviews using Claude AI, post owner responses to Google on your behalf when you approve them, send you email notifications about new reviews, and provide analytics about your review health and response rate. We do not use your information for advertising, and we do not sell your data to any third party under any circumstances.`,
        },
        {
          title: '4. Google user data',
          body: `reviewzhealth uses Google OAuth to authenticate users and accesses Google Business Profile data through Google's official APIs. We request the following Google permissions: your basic profile information (name, email, profile photo), access to your Google Business Profile locations, and the ability to read and respond to reviews on your behalf. Our use of data received from Google APIs complies with the Google API Services User Data Policy, including the Limited Use requirements. We only access Google data that is necessary to provide the reviewzhealth service, and we do not use Google user data for any purpose other than providing and improving the service as described in this policy.`,
        },
        {
          title: '5. AI-generated content',
          body: `reviewzhealth uses Anthropic's Claude AI to generate draft responses to your customer reviews. Review content is sent to Anthropic's API for this purpose. Anthropic's use of this data is governed by their privacy policy at anthropic.com. No response is ever posted to any platform without your explicit approval.`,
        },
        {
          title: '6. Data storage and security',
          body: `Your data is stored in a PostgreSQL database hosted on Railway's managed infrastructure, which runs on Amazon Web Services in the United States. We use industry-standard security practices including encrypted connections, secure authentication tokens, and access controls. We retain your data for as long as your account is active. If you delete your account, your data is deleted within 30 days.`,
        },
        {
          title: '7. Data sharing',
          body: `We do not sell, trade, or rent your personal information to any third party. We share data only with the following service providers who help us operate the service: Railway (database hosting), Anthropic (AI response generation), Stripe (payment processing), SendGrid (email delivery), and Google (authentication and Business Profile API). Each of these providers is contractually obligated to protect your data and use it only to provide their services to us.`,
        },
        {
          title: '8. Team members',
          body: `If you invite team members to your reviewzhealth account, those team members will have access to your business review data and response drafts as permitted by the role you assign them. You are responsible for managing team member access and removing access when it is no longer needed.`,
        },
        {
          title: '9. Cookies and local storage',
          body: `reviewzhealth uses browser local storage to maintain your login session and store your preferences such as demo mode and platform connection URLs. We do not use third-party tracking cookies or advertising cookies of any kind.`,
        },
        {
          title: '10. Your rights',
          body: `You have the right to access the personal information we hold about you, request correction of inaccurate information, request deletion of your account and associated data, disconnect your Google Business Profile at any time from the Settings page, and export your data upon request. To exercise any of these rights, contact us at nathan@reviewzhealth.com.`,
        },
        {
          title: '11. Children\'s privacy',
          body: `reviewzhealth is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.`,
        },
        {
          title: '12. Changes to this policy',
          body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by displaying a notice in the application. Your continued use of reviewzhealth after changes are posted constitutes acceptance of the updated policy.`,
        },
        {
          title: '13. Contact',
          body: `If you have questions about this Privacy Policy or how we handle your data, please contact us at nathan@reviewzhealth.com or write to us at Greenhalgh Holdings LLC, Orem, Utah, United States.`,
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
