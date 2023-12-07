// https://lldev.thespacedevs.com/2.2.0/launcher/?limit=20
// https://lldev.thespacedevs.com/2.2.0/launcher/ID/
const GET_TYPE = 'request';

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

const $mainTableTemplate = document.querySelector('#main-table');

const $tableRowTemplate = document.querySelector('.table-row');

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

function humanize(str) {
  let i,
    frags = str.split('_');
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

function onOpenHomePage(event) {
  if (data.view !== 'home-container') changeView('home-container');
}

function createDivider() {
  const $newDivider = document.createElement('div');
  $newDivider.classList.add('divider');
  return $newDivider;
}

function createTableRow(text1, text2) {
  const $newRow = $tableRowTemplate.cloneNode(true);
  $newRow.children[0].textContent = text1;
  $newRow.children[1].textContent = text2;
  $newRow.classList.remove('hidden');
  return $newRow;
}

function createTextEntryForSingle(text) {
  const $newTextDiv = document.createElement('p');
  $newTextDiv.textContent = text;
  return $newTextDiv;
}
const main_Order = [
  'status',
  'flights',
  'attempted_landings',
  'successful_landings',
  'first_launch_date',
  'last_launch_date',
];
const launcherConfig_Order = [
  'active',
  'reusable',
  'pending_launches',
  'total_launch_count',
  'successful_launches',
  'consecutive_successful_launches',
  'failed_launches',

  'attempted_landings',
  'successful_landings',
  'failed_landings',
];
function loadSingleEntry(entry) {
  $singleEntryImage.src = entry.image_url;
  const $newMainTable = $mainTableTemplate.cloneNode(true);
  const $newMainTbody = $newMainTable.querySelector('tbody');
  $newMainTable.classList.remove('hidden');

  const $launcherConfigTable = $mainTableTemplate.cloneNode(true);
  const $launcherConfigTbody = $launcherConfigTable.querySelector('tbody');
  $launcherConfigTable.classList.remove('hidden');

  const $newHeader2 = document.createElement('h2');
  $newHeader2.textContent = `${entry.launcher_config.full_name} ${entry.serial_number}`;
  $newHeader2.style['font-size'] = header2FontSize;
  $singleEntryInfoContainer.append($newHeader2);

  // let $divider = createDivider();
  // $singleEntryInfoContainer.append($divider);

  const entryDetails = entry.details;

  // let $details = createTextEntryForSingle();
  // $details.textContent = entry.launcher_config.description;
  // $details.style['font-size'] = header2FontSize;
  // $singleEntryInfoContainer.append($details);

  let $divider = createDivider();
  $singleEntryInfoContainer.append($divider);

  // $divider = createDivider();
  // $singleEntryInfoContainer.append($divider);

  // serial information header
  const $serialHeader = document.createElement('h3');
  $serialHeader.id = 'serial-info-header';
  $serialHeader.textContent = 'Serial Information';
  $singleEntryInfoContainer.append($serialHeader);

  // let $details = createTextEntryForSingle();
  // $details.id = "serial-details"
  // $details.textContent = entry.details;
  // $details.style['font-size'] = header2FontSize;
  // $singleEntryInfoContainer.append($details);

  // main order table
  $singleEntryInfoContainer.append($newMainTable);
  main_Order.forEach(function (value) {
    const $tr = createTableRow(humanize(value), entry[value]);
    $newMainTbody.append($tr);
  });

  const $launcherConfigHeader = document.createElement('h3');
  $launcherConfigHeader.id = 'launcher-config-information';
  $launcherConfigHeader.textContent = 'Launcher Config Information';
  $singleEntryInfoContainer.append($launcherConfigHeader);


  launcherConfig_Order.forEach(function (value) {
    const $tr = createTableRow(humanize(value), entry.launcher_config[value]);
    $launcherConfigTbody.append($tr);
  });
  $singleEntryInfoContainer.append($launcherConfigTable);

  // const $launcherConfigText = createTextEntryForSingle(entry.launcher_config.description)
  // $launcherConfigText.style["font-size"] = header2FontSize
  // $singleEntryInfoContainer.append($launcherConfigText)
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
