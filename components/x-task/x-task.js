'use strict';

window.XTask = (function() {
  var currentScriptElement = document._currentScript || document.currentScript;
  var importDoc = currentScriptElement.ownerDocument;

  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function() {
    var _done = false, _content = '', _bgcolor = '#ddd';

    function _initialize(self) {
      var template = importDoc.querySelector('#task-template');
      if (!template) {
        template = document.querySelector('#task-template');
      }

      var clone = document.importNode(template.content, true);
      
      var initialDOM = self.innerHTML;
      self.innerHTML = '';

      self.appendChild(clone);

      self.setAttribute('draggable', true);

      self.done = self.getAttribute('done') !== null? true: false;
      _setContent(self, initialDOM);
      _setEventListeners(self);
    }

    function _setContent(self, initialDOM) {
      self.querySelector('.task_content').innerHTML = initialDOM;
    }

    function _setWidth(self) {
      if(self.done) {
        self.querySelector('.task_wrapper').className = 'task_wrapper col-md-12';
      }
      else {
        self.querySelector('.task_wrapper').classList.add('col-md-6');
      }
    }

    function _setBgColor(self, color) {
      self.querySelector('.task').style.background = self.bgcolor;
    }

    function _setEventListeners(self) {
      self.querySelector('i').onclick = function() {
        self.style.display = 'none';
        _fireEvent(self);
      };

      self.addEventListener('dragstart', function(e) {
        this.querySelector('.task').style.border = '1px solid #aaa';
      });

      self.addEventListener('dragend', function(e) {
        this.querySelector('.task').style.border = '';
      });
    }

    function _fireEvent(self) {
      var event = new CustomEvent('closed');
      self.dispatchEvent(event);
    }

    Object.defineProperty(this, 'content', {
      get: function() {
        return _content;
      },
      set: function(content) {
        _content = content;
        _setContent(this, content);
      }
    });

    Object.defineProperty(this, 'done', {
      get: function() {
        return _done;
      },
      set: function(done) {
        _done = done;
        this.bgcolor = '#ddd';
        _setWidth(this);
      }
    });

    Object.defineProperty(this, 'bgcolor', {
      get: function() {
        return _bgcolor;
      },
      set: function(bgcolor) {
        _bgcolor = bgcolor;
        _setBgColor(this);
      }
    });

    _initialize(this);

    Object.seal(this);
  };

  proto.attributeChangedCallback = function(attr, oldVal, newVal) {
    if(attr === 'done'){
      this.done = (newVal !== null)? true: false;
    }
  };

  var ModalElement = document.registerElement('x-task', {
    prototype: proto
  });

  Object.freeze(proto);

  return ModalElement;
})();