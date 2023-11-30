// https://lldev.thespacedevs.com/2.2.0/launcher/?limit=20
// https://lldev.thespacedevs.com/2.2.0/launcher/ID/
const $listEntry = document.querySelector('.list-entry')
const $listContainer = document.querySelector('.masonry-holder');

import entries20 from "./Entries_20.json" assert { type: 'json'}

console.log(entries20);
function renderListEntry(entry){
  const $clone = $listEntry.cloneNode(true)
  $clone.classList.remove('hidden')
  $clone.querySelector('img').src = entry.image_url
  return $clone
}

for (let i = 0; i < entries20.results.length; i++){
  const dataEntry = entries20.results[i]
  const $entry = renderListEntry(dataEntry)
  console.dir($listContainer)
  $listContainer.append($entry)
}
