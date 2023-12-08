/* exported data */

const LOCAL_STORAGE_KEY = 'ajax_project_1';

let data = {
  view: 'home-container',
  singleEntry: null,
  saves:{},
  cachedIDs: []
};

const oldData = localStorage.getItem(LOCAL_STORAGE_KEY);
if (oldData) data = JSON.parse(oldData);

window.addEventListener('unload', function (event) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
});
