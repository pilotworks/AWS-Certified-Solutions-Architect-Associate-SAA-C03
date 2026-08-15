import React from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '../components/seo/page-head';

export const NotFoundPage: React.FC = () => (
  <div className="max-w-3xl mx-auto py-20 px-4 text-center">
    <PageHead
      title="Page Not Found"
      description="The requested AWS SAA-C03 Learning Hub page could not be found."
      canonicalPath="/404"
      robots="noindex, follow"
    />
    <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
      404
    </p>
    <h1 className="mt-2 text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
      Page not found
    </h1>
    <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
      This AWS SAA-C03 learning resource does not exist.
    </p>
    <Link
      to="/"
      className="inline-flex mt-6 px-4 py-2 rounded-lg text-sm font-semibold"
      style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--text-accent)' }}
    >
      Return to dashboard
    </Link>
  </div>
);
