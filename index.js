const STORE = {
  items: [
    {id: 1, name: 'apples', checked: false},
    {id: 2, name: 'apples', checked: false},
    {id: 3, name: 'ples', checked: false},
    {id: 4, name: 'oranges', checked: false},
    {id: 5, name: 'milk', checked: true},
    {id: 6, name: 'bread', checked: false}
  ],
  displayChecked: false,
  searchTerm: null,
  nextId: 7
};

function toggleDisplayItemsNotChecked(){
  STORE.displayChecked = !STORE.displayChecked;
}

function generateItemElement(item) {
  return `
  <li class="js-item-index-element" data-item-index="${item.id}">
    <span id="js-shopping-item" class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="edit-item-form-wrapper hidden">
      <form class="shopping-list-item-edit-form">
        <label for="shopping-list-item-edit">Edit this item</label>
        <input type="text" name="shopping-list-item-edit" class="js-shopping-list-item-edit" value="${item.name}">
        <button type="submit" class="js-shopping-list-edit-button">Finish</button>
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

function getItemById(id){
  const shoppingItem = STORE.items.find(item => item.id === id);
  return shoppingItem;
}

function getItemIndexFromElement(item){
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function addItemToShoppingList(itemName) {
  STORE.items.push({id: STORE.nextId, name: itemName, checked: false});
  STORE.nextId++;
}

function editItem(itemId,value){
  const item = getItemById(itemId);
  item.name = value;
}

function deletItemFromStore(id){
  const index = STORE.items.findIndex(item => item.id === id);
  STORE.items.splice(index,1);
}

function searchItems(searchTerm){
  let searchItems = [...STORE.items];
  searchItems = searchItems.filter(item => item.name.includes(searchTerm) );
  return searchItems;
}

function toggleCheckedForListItem(id){
  const item = getItemById(id);
  item.checked = !item.checked;
}

function resetResults(){
  $('#reset-results')
    .on('click', e => {
      STORE.searchTerm = null;
      renderShoppingList();
    }); 
}

function handleNewItemSubmit(){
  $('#js-shopping-list-form').submit(e => {
    e.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });  
}

function handleItemEdit(){
  $('.js-shopping-list')
    .on('submit', '.shopping-list-item-edit-form', e => {
      e.preventDefault();
      const val = $(e.currentTarget).children('.js-shopping-list-item-edit').val();
      const id = getItemIndexFromElement(e.currentTarget);
      editItem(id,val);
      renderShoppingList();
    });
}

function handleDeleteItemClicked(){
  $('.js-shopping-list').on('click', '.js-item-delete', e => {
    e.preventDefault();
    const itemIndex = getItemIndexFromElement(e.currentTarget);
    deletItemFromStore(itemIndex);
    renderShoppingList();
  });
}

function handleItemCheckClicked(){
  $('.js-shopping-list').on('click','.js-item-toggle', e => {
    e.preventDefault();
    const itemIndex = getItemIndexFromElement(e.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleItemsNotChecked(){
  $('#show_not_purchased').on('change', e => {
    toggleDisplayItemsNotChecked();
    renderShoppingList(); 
  });
}

function handleItemSearch(){
  $('#js-shopping-search-form').submit(e => {
    e.preventDefault();
    const searchTerm = $('.js-shopping-list-search').val();
    $('.js-shopping-list-search').val('');
    STORE.searchTerm = searchTerm;
    renderShoppingList();
  });  
}

function showHideEditForm(){
  $('.js-shopping-list')
    .on('click', '.shopping-item-edit', function(e) {
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

function attachHandlers(){
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleItemsNotChecked();
  handleItemSearch();
  resetResults();
  handleItemEdit();
  showHideEditForm();
}

function renderShoppingList(){
  const shoppingListItemsString = generateShoppingItemsString();
  $('.js-shopping-list').html(shoppingListItemsString);
}

function handleShoppingList() {
  renderShoppingList();
  attachHandlers();
}

$(handleShoppingList);