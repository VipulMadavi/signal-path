'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger in input fields
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      // "/" — focus global search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
        searchInput?.focus();
      }

      // "Escape" — close any open modal
      if (e.key === 'Escape') {
        const closeBtn = document.querySelector<HTMLButtonElement>('[data-modal-close]');
        closeBtn?.click();
      }

      // Alt+number — quick navigation
      if (e.altKey && e.key === '1') { e.preventDefault(); router.push('/'); }
      if (e.altKey && e.key === '2') { e.preventDefault(); router.push('/companies'); }
      if (e.altKey && e.key === '3') { e.preventDefault(); router.push('/lists'); }
      if (e.altKey && e.key === '4') { e.preventDefault(); router.push('/saved'); }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);
}
