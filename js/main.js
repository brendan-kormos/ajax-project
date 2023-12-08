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

const $mainTableTemplate = document
  .querySelector('#main-table')
  .cloneNode(true);

const $tableRowTemplate = document.querySelector('.table-row').cloneNode(true);
const $saveButtonTemplate = document
  .querySelector('.save-button')
  .cloneNode(true);
const $main = document.querySelector('main');

// import singleEntryJSON from './currentSingleEntry.json' assert { type: 'json' };
// import entries20JSON from './Entries_20.json' assert { type: 'json' };

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

function resetSingleEntryPage() {
  $singleEntryImage.src = '';
  for (const child of Array.from($singleEntryInfoContainer.children)) {
    $singleEntryInfoContainer.removeChild(child);
  }
}

function changeView(view, initial) {
  if (initial) {
    views$[view].classList.remove('hidden');
    data.view = view;
    return;
  }
  if (data.view === 'single-entry-container') {
    resetSingleEntryPage();
  }
  views$[data.view].classList.add('hidden');
  views$[view].classList.remove('hidden');
  data.view = view;
}

function renderListEntry(entry) {
  const $clone = $listEntry.cloneNode(true);
  $clone.classList.remove('hidden');
  $clone.querySelector('img').src = entry.image_url;
  $clone
    .querySelector('.entry-image-a')
    .setAttribute('data-serial', entry.serial_number);
  $clone.setAttribute('data-id', entry.id);
  return $clone;
}

function initHomePage(retrieval) {
  const appendNodes = (dataEntry) => {
    const $entry = renderListEntry(dataEntry);
    $listContainer.append($entry);
    if (data.saves[dataEntry.id.toString()]) {
      setSaveIcon($entry.querySelector('.save-button-i'), true);
    }
  };

  if (retrieval === 'local' && data.cachedIDs.length > 0) {
    for (let i = 1; i <data.cachedIDs.length; i++) {
      const dataEntry = data.cachedIDs[i];
      appendNodes(dataEntry);
    }
  } else if (retrieval === 'request') {
    const xhr = ajaxGET(
      'https://lldev.thespacedevs.com/2.2.0/launcher/?limit=20',
    );
    xhr.addEventListener('load', function () {
      const response = xhr.response;
      for (let i = 0; i < response.results.length; i++) {
        const dataEntry = response.results[i];
        data.cachedIDs[dataEntry.id] = dataEntry;
        appendNodes(dataEntry);
      }
    });
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

function isUTCDateFormat(str) {
  const utcDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  return utcDatePattern.test(str);
}

function humanizeDate(utcDateString) {
  //date example: '2018-12-05T18:16:16Z';
  const utcDate = new Date(utcDateString);
  const localDateString = utcDate.toLocaleString(); // Use the default options
  return localDateString;
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
  data.singleEntry = entry;

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

  const $saveButton = $saveButtonTemplate.cloneNode(true);
  $saveButton.classList.remove('lock-top-right');
  $saveButton.style['margin-left'] = '10px';
  setSaveIcon($saveButton.children[0], !!data.saves[entry.id]);
  $newHeader2.append($saveButton);

  let $divider = createDivider();
  $singleEntryInfoContainer.append($divider);

  const $serialHeader = document.createElement('h3');
  $serialHeader.id = 'serial-info-header';
  $serialHeader.textContent = 'Serial Information';
  $singleEntryInfoContainer.append($serialHeader);

  // main order table
  $singleEntryInfoContainer.append($newMainTable);
  main_Order.forEach(function (value) {
    const formatted = isUTCDateFormat(entry[value])
      ? humanizeDate(entry[value])
      : entry[value];
    const $tr = createTableRow(humanize(value), formatted);
    $newMainTbody.append($tr);
  });

  const $launcherConfigHeader = document.createElement('h3');
  $launcherConfigHeader.id = 'launcher-config-information';
  $launcherConfigHeader.textContent = 'Launcher Config Information';
  $singleEntryInfoContainer.append($launcherConfigHeader);

  launcherConfig_Order.forEach(function (value) {
    const formatted = isUTCDateFormat(entry.launcher_config[value])
      ? humanizeDate(entry[value])
      : entry.launcher_config[value];
    const $tr = createTableRow(humanize(value), formatted);
    $launcherConfigTbody.append($tr);
  });
  $singleEntryInfoContainer.append($launcherConfigTable);
}

function saveEntry(id) {
  data.saves[id.toString()] = data.cachedIDs[id];
}

function setSaveIcon($element, save) {
  if (save === true) {
    $element.classList.replace('fa-regular', 'fa-solid');
    $element.classList.replace('save-button-i', 'unsave-button-i');
    return;
  }
  $element.classList.replace('fa-solid', 'fa-regular');
  $element.classList.replace('unsave-button-i', 'save-button-i');
}

function onListEntryClicked(event) {
  const $target = event.target;
  const classList = $target.classList;
  const tagName = $target.tagName;
  const $listEntry = $target.closest('.list-entry');
  if (!$listEntry) return;
  if (classList.contains('save-button-i')) {
    //save
    setSaveIcon($target, true);
    saveEntry($listEntry.dataset.id);
    return;
  } else if (classList.contains('unsave-button-i')) {
    //unsave
    return;
  }
  if (singleEntryRequest) {
    singleEntryRequest.abort();
    singleEntryRequest = null;
  }

  if (GET_TYPE === 'local' && data.singleEntry) {
    //prefer local
    loadSingleEntry(data.singleEntry);
  } else {
    //request
    const xhr = ajaxGET(
      `https://lldev.thespacedevs.com/2.2.0/launcher/${$listEntry.dataset.id}/`,
    );
    xhr.addEventListener('load', function () {
      const response = xhr.response;

      loadSingleEntry(response);
    });
    singleEntryRequest = xhr;
  }

  changeView('single-entry-container');
}

function onSingleEntryContainerClicked(event) {
  const $target = event.target;
  const classList = $target.classList;
  const tagName = $target.tagName;
  if (classList.contains('save-button-i')) {
    //save
    setSaveIcon($target, true);
    saveEntry(data.singleEntry.id);
    return;
  } else if (classList.contains('unsave-button-i')) {
    //unsave
    return;
  }
}

$homeNavButton.addEventListener('click', onOpenHomePage);
views$['home-container'].addEventListener('click', onListEntryClicked);
views$['single-entry-container'].addEventListener(
  'click',
  onSingleEntryContainerClicked,
);

initHomePage(GET_TYPE);
for (const child of $main.children) {
  child.classList.add('hidden');
}

if (data.view === 'single-entry-container') loadSingleEntry(data.singleEntry);
changeView(data.view, true);
