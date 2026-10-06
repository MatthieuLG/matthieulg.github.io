import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useState } from 'react';

export interface ProjectItem {
  id: string;
  category: string;
  title: string;
  /** Discipline et nature, ex. « Football, recherche ». */
  meta: string;
  context: string;
  year: number;
  award?: string;
  description: string;
  steps: string[];
  stack: string[];
  links: { label: string; href: string }[];
}

interface Props {
  projects: ProjectItem[];
  categories: { id: string; label: string }[];
  labels: { filter: string; steps: string; tools: string };
}

/**
 * Index typographique des projets : une ligne par projet, qui se déplie sur sa fiche
 * (description, étapes, outils, liens). Un seul projet ouvert à la fois.
 */
export default function Projects({ projects, categories, labels }: Props) {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState<string | null>(projects[0]?.id ?? null);

  const inFilter = (id: string) => (id === 'all' ? projects : projects.filter((p) => p.category === id));
  const visible = inFilter(filter);

  return (
    <div>
      <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-x-8 gap-y-2">
        {categories.map((c) => {
          const on = filter === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setFilter(c.id);
                const next = inFilter(c.id);
                if (!next.some((p) => p.id === open)) setOpen(next[0]?.id ?? null);
              }}
              className={`-my-2 inline-flex items-baseline gap-2 border-b-2 py-2 text-[1.0625rem] font-semibold transition-colors ${
                on ? 'border-ballon text-craie' : 'border-transparent text-brume hover:text-craie'
              }`}
            >
              {c.label}
              <span className="figures text-[0.9375rem] font-medium text-brume">{inFilter(c.id).length}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-9 border-b border-craie/15">
        {visible.map((p) => {
          const isOpen = open === p.id;
          return (
            <li key={p.id} className="border-t border-craie/15">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  aria-expanded={isOpen}
                  aria-controls={`projet-${p.id}`}
                  className="group grid w-full grid-cols-[minmax(0,1fr)_1.5rem] items-start gap-x-5 py-6 text-left lg:grid-cols-[5rem_minmax(0,1fr)_14rem_1.5rem] lg:items-baseline lg:gap-x-8 lg:py-7"
                >
                  <span className="figures hidden text-[1.0625rem] font-medium text-brume lg:block">{p.year}</span>

                  <span className="min-w-0">
                    <span
                      className={`block text-[1.3125rem] font-semibold leading-[1.2] tracking-[-0.01em] transition-colors [font-stretch:106%] lg:text-[1.75rem] ${
                        isOpen ? 'text-craie' : 'text-craie/75 group-hover:text-craie'
                      }`}
                    >
                      {p.title}
                    </span>
                    {p.award && (
                      <span className="mt-2 block text-[0.9375rem] font-semibold text-ballon-clair">{p.award}</span>
                    )}
                    <span className="mt-2 block text-[0.875rem] text-brume lg:hidden">
                      {p.meta}
                      <span className="figures ml-3">{p.year}</span>
                    </span>
                  </span>

                  <span className="hidden text-[0.9375rem] text-brume lg:block">{p.meta}</span>

                  <span
                    className={`mt-1 inline-flex size-6 items-center justify-center transition-[transform,color] duration-300 lg:mt-0 lg:self-center ${
                      isOpen ? 'rotate-45 text-ballon' : 'text-brume group-hover:text-craie'
                    }`}
                    aria-hidden="true"
                  >
                    <Plus size={22} strokeWidth={1.8} />
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`projet-${p.id}`}
                    key="fiche"
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: [0.3, 0, 0.2, 1] }}
                  >
                    <div className="grid gap-x-12 gap-y-9 pb-11 pt-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1.2fr)_minmax(0,0.6fr)] lg:pb-14 lg:pl-[7rem] lg:pr-[3.5rem]">
                      <div>
                        <p className="text-[0.875rem] font-semibold text-brume">{p.context}</p>
                        <p className="mt-3 max-w-[60ch] leading-[1.65] text-craie/90">{p.description}</p>
                        {p.links.length > 0 && (
                          <div className="mt-7 flex flex-wrap gap-3">
                            {p.links.map((link, i) => (
                              <a
                                key={link.href}
                                className={`btn ${i === 0 ? 'btn-ballon' : 'btn-ligne'}`}
                                href={link.href}
                                target="_blank"
                                rel="noopener"
                              >
                                {link.label}
                                <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-[0.875rem] font-semibold text-brume">{labels.steps}</h4>
                        <ol className="mt-3 space-y-2.5">
                          {p.steps.map((step, i) => (
                            <li key={step} className="grid grid-cols-[1.5rem_minmax(0,1fr)] text-[0.9375rem] leading-[1.5]">
                              <span className="figures font-semibold text-brume">{i + 1}</span>
                              <span className="text-craie/90">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-[0.875rem] font-semibold text-brume">{labels.tools}</h4>
                        <ul className="mt-3 space-y-1.5 text-[0.9375rem] font-medium leading-[1.5]">
                          {p.stack.map((tool) => (
                            <li key={tool}>{tool}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
