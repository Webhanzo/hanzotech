'use client';

import { useEffect, useState } from 'react';

interface SocialLinkProps {
  service: 'facebook' | 'instagram' | 'whatsapp';
  url: string;
  children: React.ReactNode;
}

const SocialLink = ({ service, url, children }: SocialLinkProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    // Basic mobile detection
    setIsMobile(/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()));
  }, []);

  const getAppUrl = () => {
    if (!isMobile) return url;

    try {
        const httpUrl = new URL(url);
        
        switch (service) {
            case 'facebook':
                // Attempt to get page ID from URL path
                const pathParts = httpUrl.pathname.split('/').filter(p => p);
                const pageId = pathParts[pathParts.length - 1];
                return `fb://page/${pageId}`; // This is a common scheme
            case 'instagram':
                const username = httpUrl.pathname.split('/').filter(p => p)[0];
                return `instagram://user?username=${username}`;
            case 'whatsapp':
                 // Expects a URL like https://wa.me/123456789 or https://wa.link/abcdef
                 return `whatsapp://send?phone=${httpUrl.pathname.replace(/\//g, '')}`;
            default:
                return url;
        }
    } catch (e) {
        // If URL parsing fails, fall back to the original URL
        return url;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) {
        window.location.href = getAppUrl();
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    e.preventDefault();
  };


  return (
    <a href={url} onClick={handleClick} aria-label={service} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default SocialLink;
