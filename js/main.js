// https://lldev.thespacedevs.com/2.2.0/launcher/?limit=20
// https://lldev.thespacedevs.com/2.2.0/launcher/ID/
const GET_TYPE = 'local';

const $listEntry = document.querySelector('.list-entry');
const $listContainer = document.querySelector('.masonry-holder');
const $homeNavButton = document.querySelector('.nav-bar-home');
const $singleEntry = document.querySelector('.single-entry');
const $singleEntryImage = document.querySelector('.single-entry img');
const root = document.querySelector(':root');
const $singleEntryInfoContainer = document.querySelector(
  '.single-entry-info-container',
);

const computedRoot = getComputedStyle(root);
const header2FontSize = computedRoot.getPropertyValue('--header-2-font-size');
const descriptionFontSize = computedRoot.getPropertyValue(
  '--description-font-size',
);
console.log(descriptionFontSize);

const $main = document.querySelector('main');

import singleEntryJSON from './currentSingleEntry.json' assert { type: 'json' };
import entries20JSON from './Entries_20.json' assert { type: 'json' };

let singleEntryRequest = null;

const views$ = {
  'single-entry-container': document.querySelector('#single-entry-container'),
  'home-container': document.querySelector('#home-container'),
};

function ajaxGET(url) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.send();
  return xhr;
}

function changeView(view, initial) {
  if (initial) {
    views$[view].classList.remove('hidden');
    data.view = view;
    return;
  }
  views$[data.view].classList.add('hidden');
  views$[view].classList.remove('hidden');
  data.view = view;
}

function renderListEntry(entry) {
  const $clone = $listEntry.cloneNode(true);
  $clone.classList.remove('hidden');
  $clone.querySelector('img').src = entry.image_url;
  $clone.querySelector('a').setAttribute('data-serial', entry.serial_number);
  $clone.setAttribute('data-id', entry.id);
  return $clone;
}

function initHomePage(retrieval) {
  if (retrieval === 'request') {
    const xhr = ajaxGET(
      'https://lldev.thespacedevs.com/2.2.0/launcher/?limit=20',
    );
    xhr.addEventListener('load', function () {
      const response = xhr.response;
      for (let i = 0; i < response.results.length; i++) {
        const dataEntry = response.results[i];
        const $entry = renderListEntry(dataEntry);
        $listContainer.append($entry);
      }
    });
  } else if (retrieval === 'local') {
    for (let i = 0; i < entries20JSON.results.length; i++) {
      const dataEntry = entries20JSON.results[i];
      const $entry = renderListEntry(dataEntry);
      $listContainer.append($entry);
    }
  }
}

function onOpenHomePage(event) {
  if (data.view !== 'home-container') changeView('home-container');
}

function createDivider() {
  const $newDivider = document.createElement('div');
  $newDivider.classList.add('divider');
  return $newDivider;
}

function createTextEntryForSingle(text) {
  const $newTextDiv = document.createElement('p');
  $newTextDiv.textContent = text;
  return $newTextDiv;
}

function loadSingleEntry(entry) {
  $singleEntryImage.src = entry.image_url;

  const $newHeader2 = document.createElement('h2');
  $newHeader2.textContent = `${entry.launcher_config.full_name} ${entry.serial_number}`;
  $newHeader2.style['font-size'] = header2FontSize;
  $singleEntryInfoContainer.append($newHeader2);
  let $divider = createDivider();
  $singleEntryInfoContainer.append($divider);

  let $details = createTextEntryForSingle();
  $details.textContent = entry.launcher_config.description;
  $details.style['font-size'] = header2FontSize;
  $singleEntryInfoContainer.append($details);

  // $divider = createDivider();
  // $divider.style.width = '100%';
  // $divider.style.left = '0';
  // $singleEntryInfoContainer.append($divider);

  $details = createTextEntryForSingle();
  $details.textContent = entry.details;
  $details.style['font-size'] = header2FontSize;
  $singleEntryInfoContainer.append($details);
}

function onListEntryClicked(event) {
  const $target = event.target;
  const $className = $target.className;
  const tagName = $target.tagName;
  const $listEntry = $target.closest('.list-entry');
  if (!$listEntry) return;
  if (singleEntryRequest) {
    console.log(singleEntryRequest);
    singleEntryRequest.abort();
    singleEntryRequest = null;
  }

  if (GET_TYPE === 'request') {
    const xhr = ajaxGET(
      `https://lldev.thespacedevs.com/2.2.0/launcher/${$listEntry.dataset.id}/`,
    );
    xhr.addEventListener('load', function () {
      const response = xhr.response;
      loadSingleEntry(response);
    });
    singleEntryRequest = xhr;
  } else if (GET_TYPE === 'local') {
    loadSingleEntry(singleEntryJSON);
  }

  changeView('single-entry-container');
}

$homeNavButton.addEventListener('click', onOpenHomePage);
views$['home-container'].addEventListener('click', onListEntryClicked);

initHomePage(GET_TYPE);
for (const child of $main.children) {
  child.classList.add('hidden');
}

if (data.view === 'single-entry-container') loadSingleEntry(singleEntryJSON);
changeView(data.view, true);
