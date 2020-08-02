class StyledSelect {
   constructor(selector, options) {
      this.selector = selector
      this.options = options
      this.$el = document.querySelector(selector);

      if (!this.$el) return;

      this.getSelectTemplate = this.getSelectTemplate.bind(this);
      this.initHandlers = this.initHandlers.bind(this);
      this.initSelectElems = this.initSelectElems.bind(this);
      this.initOptions = this.initOptions.bind(this);
      this.toggleOpen = this.toggleOpen.bind(this);
      this.clickHandler = this.clickHandler.bind(this);
      this.getCustomClass = this.getCustomClass.bind(this);


      this.init()
   }

   init() {
      this.$el.classList.add('initial-select-hide');

      this.render();
      this.initSelectElems();
      this.initHandlers();
      this.initOptions();
   }

   initHandlers() {
      this.$styledSelect.addEventListener('click', this.clickHandler);
   }

   initSelectElems() {
      this.$styledSelect = document.querySelector('.styled-select');
      this.$input = this.$styledSelect.querySelector('.styled-select__input');
      this.$inputCurrent = this.$styledSelect.querySelector('.styled-select__current');
      this.$dropdown = this.$styledSelect.querySelector('.styled-select__dropdown');
      this.$select = this.$styledSelect.querySelector(this.selector);
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
      this.$styledSelect.querySelector(`[data-id="${id}"]`).classList.add('selected')


      this.$select.value = this.$styledSelect.querySelector(`[data-id="${id}"]`).dataset.id
      this.$inputCurrent.textContent = this.$styledSelect.querySelector(`[data-id="${id}"]`).textContent
      this.$input.classList.remove('styled-select__input-placeholder');

      this.close()
   }

   clickHandler(event) {
      const {type} = event.target.dataset

      if (type === 'input') {
         this.toggleOpen()
      } else if (type === 'item') {
         const id = event.target.dataset.id

         this.selectItem(id)
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
      newTemplate.innerHTML = `
                ${this.$el.outerHTML}
                <div class="styled-select__backdrop" data-type="backdrop"></div>
                <div class="styled-select__input ${placeholderClass}" data-type="input" >
                    <span class="styled-select__current">${placeholder}</span>
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
         options.push({text: item.textContent, value: item.value})
      })

      return options;
   }

   getOptionsTemplates(options) {
      return options.map(option => {
         return `<div class="styled-select__item" data-id=${option.value} data-type="item">${option.text}</div>`
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
}

