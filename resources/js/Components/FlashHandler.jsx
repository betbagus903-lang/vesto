import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashHandler() {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash.success) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message: flash.success, type: 'success' }
      }));
    }
    
    if (flash.error) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message: flash.error, type: 'error' }
      }));
    }
  }, [flash.success, flash.error]);

  return null;
}