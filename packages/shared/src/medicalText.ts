// Reads the AI service's markdown-like answer text into titled sections, and the words that get a status colour. Shared by the website and the phone app.

// ── Status badge colors ───────────────────────────────────────────────────────

export const STATUS_RE = /(\b(?:high|elevated|low|decreased|normal|critical|abnormal|mild|moderate|severe|positive|negative|borderline|increased|reduced)\b)/gi;

export const STATUS_COLORS: Record<string, { c: string; b: string }> = {
  high:       { c: '#fbbf24', b: 'rgba(251,191,36,0.18)'  },
  elevated:   { c: '#fbbf24', b: 'rgba(251,191,36,0.18)'  },
  increased:  { c: '#fbbf24', b: 'rgba(251,191,36,0.18)'  },
  low:        { c: '#60a5fa', b: 'rgba(96,165,250,0.18)'  },
  decreased:  { c: '#60a5fa', b: 'rgba(96,165,250,0.18)'  },
  reduced:    { c: '#60a5fa', b: 'rgba(96,165,250,0.18)'  },
  normal:     { c: '#34d399', b: 'rgba(52,211,153,0.18)'  },
  negative:   { c: '#34d399', b: 'rgba(52,211,153,0.18)'  },
  critical:   { c: '#f87171', b: 'rgba(248,113,113,0.18)' },
  abnormal:   { c: '#f87171', b: 'rgba(248,113,113,0.18)' },
  severe:     { c: '#f87171', b: 'rgba(248,113,113,0.18)' },
  positive:   { c: '#f87171', b: 'rgba(248,113,113,0.18)' },
  moderate:   { c: '#fb923c', b: 'rgba(251,146,60,0.18)'  },
  borderline: { c: '#fb923c', b: 'rgba(251,146,60,0.18)'  },
  mild:       { c: '#a3e635', b: 'rgba(163,230,53,0.18)'  },
};

// ── Section parser ────────────────────────────────────────────────────────────

export interface Section { title: string; lines: string[] }

export function parseSections(text: string): Section[] {
  const sections: Section[] = [];
  let cur: Section = { title: '', lines: [] };

  for (const raw of text.split('\n')) {
    const hm  = raw.match(/^#{1,4}\s+(.+)/);
    const bm  = !hm && raw.match(/^\*\*([^*]{3,55})\*\*\s*[:-]?\s*$/);
    const title = hm?.[1]?.trim() || bm?.[1]?.trim();

    if (title) {
      if (cur.lines.some(l => l.trim()) || cur.title) sections.push(cur);
      cur = { title, lines: [] };
    } else {
      cur.lines.push(raw);
    }
  }
  if (cur.lines.some(l => l.trim()) || cur.title) sections.push(cur);
  return sections.length ? sections : [{ title: '', lines: text.split('\n') }];
}

