// https://lldev.thespacedevs.com/2.2.0/launcher/?limit=20
// https://lldev.thespacedevs.com/2.2.0/launcher/ID/
const $listEntry = document.querySelector('.list-entry');
const $listContainer = document.querySelector('.masonry-holder');
const $homeNavButton = document.querySelector('.nav-bar-home');

const $main = document.querySelector('main');

import entries20JSON from './Entries_20.json' assert { type: 'json' };

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
  if (retrieval === 'get') {
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
function onListEntryClicked(event) {
  const $target = event.target;
  const $className = $target.className;
  const tagName = $target.tagName;
  const $listEntry = $target.closest('.list-entry');
  if ($listEntry) {
    changeView('single-entry-container');
  }
}

$homeNavButton.addEventListener('click', onOpenHomePage);
views$['home-container'].addEventListener('click', onListEntryClicked);

initHomePage('local');
for (const child of $main.children) {
  child.classList.add('hidden');
}

changeView(data.view, true);
