const STORE = [
  {name: 'apples', checked: false},
  {name: 'oranges', checked: false},
  {name: 'milk', checked: true},
  {name: 'bread', checked: false}
];

function generateItemElement(item, itemIndex, template) {
  return `
  <li class="js-item-index-element" data-item-index="${itemIndex}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
      </button>
    </div>
  </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item,index));
  return items.join('');
}

function renderShoppingList(){
  console.log('renderShoppingList ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE);
  $('.js-shopping-list').html(shoppingListItemsString);
}

function handleNewItemSubmit(){
  $('#js-shopping-list-form').submit(function(e){
    e.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    console.log(newItemName);
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });  
}

function toggleCheckedForListItem(itemIndex){
  console.log('toggling check property for item at index ' + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}

function addItemToShoppingList(itemName) {
  console.log(`Adding ${itemName} to shopping list`);
  STORE.push({name: itemName, checked: false});
}

function getItemIndexFromElement(item){
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked(){
  // console.log('handleItemCheckClicked ran');
  $('.js-shopping-list').on('click','.js-item-toggle', e => {
    console.log('handleItemCheckClicked ran');
    const itemIndex = getItemIndexFromElement(e.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deletItemFromStore(index){
  STORE.splice(index,1);
}

function handleDeleteItemClicked(){
  console.log('handleDeleteItemClicked ran');
  $('.js-shopping-list').on('click', '.js-item-delete', e => {
    const itemIndex = getItemIndexFromElement(e.currentTarget);
    deletItemFromStore(itemIndex);
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

$(handleShoppingList);