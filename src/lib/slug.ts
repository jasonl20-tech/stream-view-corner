export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const replacements: { [key: string]: string } = {
        'ä': 'ae',
        'ö': 'oe', 
        'ü': 'ue',
        'ß': 'ss'
      };
      return replacements[match] || match;
    })
    .replace(/[^a-z0-9\s-]/g, '') // Entferne Sonderzeichen
    .replace(/\s+/g, '-') // Leerzeichen zu Bindestrichen
    .replace(/-+/g, '-') // Mehrfache Bindestriche zu einem
    .replace(/^-|-$/g, ''); // Bindestriche am Anfang/Ende entfernen
};

export const decodeSlug = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};