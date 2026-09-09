import { useEffect } from 'react';

interface KeyboardHandlers {
  onNext?: () => void;
  onPrev?: () => void;
  onCompose?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
  onEscape?: () => void;
  onToggleSound?: () => void;
}

export function useKeyboardNav(handlers: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key === 'Escape' && handlers.onEscape) {
          handlers.onEscape();
        }
        return;
      }

      switch (e.key) {
        case 'j':
        case 'J':
        case 'ArrowDown':
          e.preventDefault();
          handlers.onNext?.();
          break;
        case 'k':
        case 'K':
        case 'ArrowUp':
          e.preventDefault();
          handlers.onPrev?.();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          handlers.onCompose?.();
          break;
        case '/':
          e.preventDefault();
          handlers.onSearch?.();
          break;
        case '?':
          e.preventDefault();
          handlers.onHelp?.();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          handlers.onToggleSound?.();
          break;
        case 'Escape':
          e.preventDefault();
          handlers.onEscape?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
