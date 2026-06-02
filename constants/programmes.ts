export const PROGRAMMES = ['IPMX', 'PGPSM', 'PGPWE', 'DGMP'] as const;
export type Programme = typeof PROGRAMMES[number];

export const PROGRAMME_LABELS: Record<Programme, string> = {
  IPMX:  'International Programme in Management for Executives',
  PGPSM: 'Post Graduate Programme in Sustainable Management',
  PGPWE: 'Post Graduate Programme for Working Executives',
  DGMP:  'Diploma in General Management Programme',
};
