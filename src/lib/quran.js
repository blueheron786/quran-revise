import pageIndex from '../data/page-index.json';
import juzMap from '../data/juz-map.json';

/** @returns {{ page, surahNum, surahName, ayahNum, firstWords } | null} */
export function getPage(pageNum) {
  return pageIndex[pageNum - 1] || null;
}

/** @returns {number[]} array of page numbers for this juz */
export function getPagesForJuz(juzNum) {
  const juz = juzMap.find(j => j.juz === juzNum);
  if (!juz) return [];
  const pages = [];
  for (let p = juz.pageStart; p <= juz.pageEnd; p++) pages.push(p);
  return pages;
}

/** @returns {object | null} juz entry from juz-map */
export function getJuz(juzNum) {
  return juzMap.find(j => j.juz === juzNum) || null;
}

export { juzMap };
