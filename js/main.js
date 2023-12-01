// https://lldev.thespacedevs.com/2.2.0/launcher/?limit=20
// https://lldev.thespacedevs.com/2.2.0/launcher/ID/
const $listEntry = document.querySelector('.list-entry');
const $listContainer = document.querySelector('.masonry-holder');

import entries20JSON from './Entries_20.json' assert { type: 'json' };

function ajaxGET(url) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.send();
  return xhr;
}

function renderListEntry(entry) {
  const $clone = $listEntry.cloneNode(true);
  $clone.classList.remove('hidden');
  $clone.querySelector('img').src = entry.image_url;
  $clone.querySelector('a').setAttribute('data-serial', entry.serial_number);
  return $clone;
}

function loadHomePage(retrieval) {
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
loadHomePage('local');
