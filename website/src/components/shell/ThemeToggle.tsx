import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

type Mode = 'light' | 'dark' | 'system';

function apply(mode: Mode) {
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = mode === 'dark' || (mode === 'system' && sysDark);
  document.documentElement.classList.toggle('dark', dark);
}

export default function ThemeToggle({ label }: { label: string }) {
  const [mode, setMode] = useState<Mode>('system');

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Mode | null) ?? 'system';
    setMode(stored);
  }, []);

  function cycle() {
    const next: Mode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
    setMode(next);
    if (next === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', next);
    }
    apply(next);
  }

  const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[rgb(var(--color-card))] transition-colors"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
