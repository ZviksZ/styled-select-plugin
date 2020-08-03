class StyledSelect {
   constructor(selector, options) {
      this.selector = typeof selector === 'string' ? selector : '.' + selector.classList[0];
      this.options = options;
      this.$el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      this.closeOnSelect = this.options.closeOnSelect || true

      if (!this.$el) return;

      this.getSelectTemplate = this.getSelectTemplate.bind(this);
      this.initHandlers = this.initHandlers.bind(this);
      this.initSelectElems = this.initSelectElems.bind(this);
      this.initOptions = this.initOptions.bind(this);
      this.toggleOpen = this.toggleOpen.bind(this);
      this.clickHandler = this.clickHandler.bind(this);
      this.getCustomClass = this.getCustomClass.bind(this);
      this.getSelectValues = this.getSelectValues.bind(this);


      this.init()
   }

   init() {
      this.$el.classList.add('initial-select-hide');

      this.render();
      this.initSelectElems();
      this.initHandlers();
      this.initOptions();


      if (this.$el.hasAttribute('multiple')){
         this.$styledSelect.classList.add('styled-select--multiple');

         this.initMultipleInput()
      } else {
         this.initSingleInput()
      }

   }

   initHandlers() {
      this.$styledSelect.addEventListener('click', this.clickHandler);
   }

   initSelectElems() {
      this.$styledSelect = document.querySelector('#' + this.$styledSelectId);
      this.$input = this.$styledSelect.querySelector('.styled-select__input');
      this.$inputCurrent = this.$styledSelect.querySelector('.styled-select__current');
      this.$dropdown = this.$styledSelect.querySelector('.styled-select__dropdown');

      this.$select = this.$styledSelect.querySelector(this.selector);
   }

   initMultipleInput() {
      let options = this.getOptions(this.$el)

      options.forEach(option => {
         if (option.selected) {
            this.removePlaceholder();
            let html = this.$inputCurrent.innerHTML + '<span data-selected="'+ option.value + '">' + option.text + '</span>'
            this.$inputCurrent.innerHTML = html
         }
      });
   }

   initSingleInput() {
      let options = this.getOptions(this.$el)

      options.forEach(option => {
         if (option.selected) {
            this.removePlaceholder();

            this.$inputCurrent.innerHTML = '<span data-selected="'+ option.value + '">' + option.text + '</span>'
         }
      });
   }

   initOptions() {
      if (this.options.defaultValue) {
         this.selectItem(this.options.defaultValue)
      }
      this.getCustomClass()
   }

   render() {
      let template = this.getSelectTemplate(this.$el);


      this.$el.parentNode.replaceChild(template, this.$el);
   }

   open() {
      this.$styledSelect.classList.add('select-open')
   }

   close() {
      this.$styledSelect.classList.remove('select-open')
   }

   toggleOpen() {
      if(this.$styledSelect.classList.contains('select-open')) {
         this.close()
      } else {
         this.open()
      }
   }

   selectItem(id) {
      this.$styledSelect.querySelectorAll('[data-type="item"]').forEach(el => {
         el.classList.remove('selected')
      })
      let selectedItem = this.$styledSelect.querySelector(`[data-id="${id}"]`);
      let selectedItemText = selectedItem.textContent
      let selectedItemValue = selectedItem.dataset.id;


      selectedItem.classList.add('selected')

      this.removePlaceholder()

      this.$select.value = selectedItem.dataset.id
      this.$inputCurrent.innerHTML = '<span data-selected="'+ selectedItemValue + '">' + selectedItem.textContent + '</span>'


      if (this.options.onSelect) {
         this.options.onSelect(id, selectedItemText)
      }

      if (this.closeOnSelect) {
         this.close()
      }

   }

   selectMultipleItems(id) {
      let selectedItem = this.$styledSelect.querySelector(`[data-id="${id}"]`);
      let selectedItemText = selectedItem.textContent;
      let selectedItemValue = selectedItem.dataset.id;

      this.removePlaceholder()


      if (selectedItem.classList.contains('selected')) {
         selectedItem.classList.remove('selected')
         this.$select.querySelector('option[value="' + selectedItemValue + '"').setAttribute('selected', false)
         this.$inputCurrent.querySelector(`[data-selected="${id}"]`).remove()

        this.setPlaceholderOnEmpty()
      } else {
         selectedItem.classList.add('selected')
         this.$select.querySelector('option[value="' + selectedItemValue + '"').setAttribute('selected', true)

         let html = this.$inputCurrent.innerHTML + '<span data-selected="'+ selectedItemValue + '">' + selectedItem.textContent + '</span>'
         this.$inputCurrent.innerHTML = html
      }

      if (this.options.onSelect) {
         this.options.onSelect(id, selectedItemText)
      }


      if (this.closeOnSelect) {
         this.close()
      }
   }

   setPlaceholderOnEmpty() {
      if(!this.$inputCurrent.querySelectorAll(`[data-selected]`).length) {
         let {placeholder, placeholderClass} = this.getPlaceholder();
         let html = '<span data-type="placeholder">' + placeholder + '</span>'
         this.$inputCurrent.innerHTML = html
         this.$input.classList.add(placeholderClass)
      }
   }

   removePlaceholder() {
      this.$input.classList.remove('styled-select__input-placeholder');

      if (this.$inputCurrent.querySelector('[data-type="placeholder"')) {
         this.$inputCurrent.querySelector('[data-type="placeholder"').remove()
      }
   }

   clickHandler(event) {

      const {type} = event.target.dataset


      if (type === 'input') {
         this.toggleOpen()
      } else if (type === 'item') {
         const id = event.target.dataset.id

         if (this.$el.hasAttribute('multiple')){
            this.selectMultipleItems(id)
         } else {
            this.selectItem(id)
         }


      } else if (type === 'backdrop') {
         this.close()
      }
   }

   getSelectTemplate(elem) {
      let options = this.getOptions(elem);
      let optionsTemplates = this.getOptionsTemplates(options);
      let {placeholder, placeholderClass} = this.getPlaceholder();
      let icon = this.getSelectIcon();

      let newTemplate = document.createElement("div");
      newTemplate.classList.add('styled-select');

      let idString = this.$el.id ? this.$el.id : Math.floor(Math.random() * 101) * Math.floor(Math.random() * 101)

      newTemplate.id = 's-s-' + idString;
      this.$styledSelectId = newTemplate.id;

      newTemplate.innerHTML = `
                ${this.$el.outerHTML}
                <div class="styled-select__backdrop" data-type="backdrop"></div>
                <div class="styled-select__input ${placeholderClass}" data-type="input" >
                    <div class="styled-select__current">
                        <span data-type="placeholder">${placeholder}</span>
                    </div>
                    
                    ${icon}
                </div>
                <div class="styled-select__dropdown"  data-type="dropdown">
                   ${optionsTemplates.join('')}
                </div>
      `

      return newTemplate
   }

   getOptions(elem) {
      let options = [];

      elem.querySelectorAll('option').forEach(function (item) {

         let selected = item.getAttribute('selected') === '' ? true : false;
         options.push({text: item.textContent, value: item.value, selected})
      })

      return options;
   }

   getOptionsTemplates(options) {
      return options.map(option => {
         if (option.selected) {
            return `<div class="styled-select__item selected" data-id=${option.value} data-type="item">${option.text}</div>`
         } else {
            return `<div class="styled-select__item" data-id=${option.value} data-type="item">${option.text}</div>`
         }

      });
   }

   getPlaceholder() {
      let placeholder = this.options.placeholder ? this.options.placeholder : 'Choose your variant'
      let placeholderClass = this.options.placeholder ? 'styled-select__input-placeholder' : ''

      return {placeholder, placeholderClass}
   }

   getSelectIcon() {
      return this.options.customIcon ? this.options.customIcon : '<span class="styled-select__icon"></span>'
   }

   getCustomClass() {
      if (this.options.customClassName) {
         this.$styledSelect.classList.add(this.options.customClassName)
      }
   }

   getSelectValues() {
      var result = [];
      var options = this.$select && this.$select.options;
      var opt;

      for (var i=0, iLen=options.length; i<iLen; i++) {
         opt = options[i];

         if (opt.selected) {
            result.push(opt.value || opt.text);
         }
      }
      return result;
   }
}

