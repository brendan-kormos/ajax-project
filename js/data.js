/* exported data */

const LOCAL_STORAGE_KEY = 'ajax_project_1';

let data = {
  view: 'home-container',
  singleEntry: null,
  saves: {},
  cachedIDs: [],
  scrollPositions: {
    'home-container': 0,
    'single-entry-container': 0,
    'saves-container': 0
  },
};

function saveScrollPosition() {
  const verticalScrollPosition = window.scrollY || window.pageYOffset;
  data.scrollPositions[data.view] = verticalScrollPosition
}
const oldData = localStorage.getItem(LOCAL_STORAGE_KEY);
if (oldData) data = JSON.parse(oldData);

window.addEventListener('unload', function (event) {
  saveScrollPosition()
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
});
