const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'apples', checked: false},
    {name: 'ples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  displayChecked: false,
  searchTerm: null
};

// Implement the following features which will require a more complex store object:
// User can press a switch/checkbox to toggle between 
// displaying all items or displaying only items that are unchecked
// User can type in a search term and the displayed 
// list will be filtered by item names only containing that search term
// User can edit the title of an item

function generateItemElement(item, itemIndex, template) {
  return `
  <li class="js-item-index-element" data-item-index="${itemIndex}">
    <span id="js-shopping-item" class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="edit-item-form-wrapper hidden">
      <form id="shopping-list-item-edit-form>
        <label for="shopping-list-item-edit">Edit this item</label>
        <input type="text" name="shopping-list-item-edit" class="js-shopping-list-item-edit" value="${item.name}">
        <button type="button" class="js-shopping-list-edit-button">Finish</button>
      </form>
    </div>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
      </button>
      <button class="shopping-item-edit js-item-edit">
        <span class="button-label">edit</span>
      </button>
    </div>
  </li>`;
}

function editItem(index,value){
  STORE.items[index].name = value;
}

function handleItemEdit(){
  $('.js-shopping-list')
    .on('click', '.js-shopping-list-edit-button',function(e){
      e.preventDefault();
      const val = $(this).prev().val();
      const index = $(this).parents('.js-item-index-element').attr('data-item-index');
      editItem(index,val);
      renderShoppingList();
    });
}

function showHideEditForm(){
  $('.js-shopping-list')
    .on('click', '.shopping-item-edit',function (e) {
      e.preventDefault();
      $(this)
        .parents('.js-item-index-element')
        .children('.edit-item-form-wrapper')
        .toggleClass('hidden');
      $(this)
        .parents('.js-item-index-element')
        .children('#js-shopping-item')
        .toggleClass('hide-span');
    });
 
}

function searchItems(searchTerm){
  let searchItems = [...STORE.items];
  searchItems = searchItems.filter(item => item.name.includes(searchTerm) );
  return searchItems;
}

function handleItemSearch(){
  $('#js-shopping-search-form').submit(function(e){
    e.preventDefault();
    const searchTerm = $('.js-shopping-list-search').val();
    $('.js-shopping-list-search').val('');
    STORE.searchTerm = searchTerm;
    renderShoppingList();
  });  
}

function resetResults(){
  $('#reset-results')
    .on('click', e => {
      STORE.searchTerm = null;
      renderShoppingList();
    }); 
}




function generateItemsForDisplay(){
  let displayItems = [...STORE.items];
  if (STORE.displayChecked){
    displayItems = displayItems.filter(item => { return !item.checked; });
  } else if (STORE.searchTerm) {
    displayItems = searchItems(STORE.searchTerm);
  }
  return displayItems;
}

function generateShoppingItemsString() {
  const displayItems = generateItemsForDisplay();
  return displayItems
    .map((item, index) => generateItemElement(item,index))
    .join('');
}

function renderShoppingList(){
  // console.log('renderShoppingList ran');
  const shoppingListItemsString = generateShoppingItemsString();
  $('.js-shopping-list').html(shoppingListItemsString);
}

function handleNewItemSubmit(){
  $('#js-shopping-list-form').submit(function(e){
    e.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });  
}



function toggleDisplayItemsNotChecked(){
  STORE.displayChecked = !STORE.displayChecked;
}

function handleItemsNotChecked(){
  $('#show_not_purchased').on('change', e => {
    toggleDisplayItemsNotChecked();
    renderShoppingList(); 
  });
}

function toggleCheckedForListItem(itemIndex){
  console.log('toggling check property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function addItemToShoppingList(itemName) {
  console.log(`Adding ${itemName} to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function getItemIndexFromElement(item){
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked(){

  $('.js-shopping-list').on('click','.js-item-toggle', e => {
    e.preventDefault();
    console.log('handleItemCheckClicked ran');
    const itemIndex = getItemIndexFromElement(e.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deletItemFromStore(index){
  STORE.items.splice(index,1);
}


function handleDeleteItemClicked(){
  
  $('.js-shopping-list').on('click', '.js-item-delete', e => {
    e.preventDefault();
    console.log('handleDeleteItemClicked ran');
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
  handleItemsNotChecked();
  handleItemSearch();
  resetResults();
  handleItemEdit();
  showHideEditForm();
}

$(handleShoppingList);