# styled-select-plugin


options: {
   placeholder: 'Custom-select',
     // defaultValue: 'two'
      //customIcon: '<i class="icon"></i>'
      //customClassName: 'custom'
      //closeOnSelect: false
   
      onSelect: function (itemValue, itemText) {
         console.log(itemValue, itemText)
      },
}



select.selectItem('two')
