/*const select = new StyledSelect('.custom-select', {
   placeholder: 'Custom-select',
  // defaultValue: 'two'
   //customIcon: '<i class="icon"></i>'
   //customClassName: 'custom'
   onSelect: function (itemValue, itemText) {
      console.log(itemValue, itemText)
   },
   closeOnSelect: false
})*/


document.addEventListener('DOMContentLoaded', function(){
   document.querySelectorAll('.custom-select').forEach(item => {
      new StyledSelect(item, {
         placeholder: 'Custom-select',
         // defaultValue: 'two'
         //customIcon: '<i class="icon"></i>'
         //customClassName: 'custom',
         //closeOnSelect: false
         onSelect: function (itemValue, itemText) {
            console.log(itemValue, itemText)
         },

      })
   })
});


//select.selectItem('two')
