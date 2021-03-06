/* 
 * Dialog.js
 * https://github.com/yhb241/Dialog.js
 */
(function(window, undefined){
    'use strict';
    var document = window.document,
        defaults = {
            type: 'confirm',
            fade: true,
            transparentMask: false,
            confirmText: window.navigator.language.toLowerCase() === 'zh-cn' ? '确定' : 'OK',
            cancelText: window.navigator.language.toLowerCase() === 'zh-cn' ? '取消' : 'Cancel'
        };
    function createDiv(className){
        var div = document.createElement('div');
        className && div.setAttribute('class', className);
        return div;
    }
    function createElements(){
        var top,
            topClassList = ['pop'],
            dialog = createDiv('pop-dialog'),
            content = createDiv('pop-content'),
            header = createDiv('pop-header'),
            body = createDiv('pop-body'),
            footer = createDiv('pop-footer'),
            btnConfirm = createDiv('primary'),
            btnCancel = createDiv();
        this.fade === true && topClassList.push('fade');
        this.transparentMask === true && topClassList.push('transparent');
        top = createDiv(topClassList.join(' '));
        btnConfirm.textContent = this.confirmText;
        btnConfirm.dataset.action = 'confirm';
        btnCancel.textContent = this.cancelText;
        btnCancel.dataset.action = 'cancel';
        this.type !== 'alert' && (footer.appendChild(btnCancel));
        footer.appendChild(btnConfirm);
        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);
        dialog.appendChild(content);
        top.appendChild(dialog);
        document.body.appendChild(top);
        return top;
    }
    function Dialog(opts){
        if(!(this instanceof Dialog)) return;
        opts && this.init(opts);
        return this;
    }
    Dialog.prototype = {
        init: function(opts){
            for(var pro in defaults){
                this[pro] = defaults[pro];
            }
            this.configure(opts);
            this.context = this.context || createElements.call(this);
            this._initEvents();
            return this;
        },
        // show([title], content, [confirm, [cancel]])
        show: function(){
            var title, content, confirm, cancel;
            // not initialize
            if(!this.context) return;
            if(arguments[1] && typeof arguments[1] === 'string'){
                title = arguments[0];
                content = arguments[1];
                confirm = arguments[2];
                cancel = arguments[3];
            }else{
                content = arguments[0];
                confirm = arguments[1];
                cancel = arguments[2];
            }
            this.context.querySelector('.pop-header').innerHTML = title || '';
            this.context.querySelector('.pop-body').innerHTML = content || '';
            confirm && typeof confirm === 'function' && (this.confirmHandler = confirm);
            cancel && typeof cancel === 'function' && (this.cancelHandler = cancel);
            document.documentElement.setAttribute('class', 'pop-show');
            document.body.setAttribute('class', 'pop-show');
            if(this.fade && this.fade === true){
                setTimeout(function(){
                    this.context.classList.add('in');
                }.bind(this), 10);
            }
            this.context.style.display = 'block';
        },
        hide: function(evt){
            this.fade && this.fade === true && (this.context.classList.remove('in'));
            this.context.style.display = 'none';
            if(this.confirmHandler){
                setTimeout(function(){
                    this.confirmHandler = null;
                }.bind(this), 5e2);
            }
            if(this.cancelHandler){
                setTimeout(function(){
                    this.cancelHandler = null;
                }.bind(this), 5e2);
            }
            // In order to directly call
            evt && evt.stopPropagation && evt.stopPropagation();
            evt && evt.preventDefault && evt.preventDefault();
            document.documentElement.setAttribute('class', '');
            document.body.setAttribute('class', '');
        },
        reset: function(){
            this._removeEvents();
            this.hide();
        },
        configure: function(opts){
            if(opts && typeof opts === 'object'){
                if(opts instanceof Object){
                    for(var pro in opts){
                        this[pro] = opts[pro];
                    }
                }
            }
        },
        _initEvents: function(){
            this.confirmHandler = this.cancelHandler = null;
            this.hideHandler = this.hideHandler || this.hide.bind(this);
            this.dialogEventProxyHandler = this.dialogEventProxyHandler || this._dialogEventProxy.bind(this);
            this.context.addEventListener('click', this.dialogEventProxyHandler, false);
        },
        _removeEvents: function(){
            this.context.removeEventListener('click', this.dialogEventProxyHandler, false);
            this.hideHandler = this.confirmHandler = this.cancelHandler = null;
        },
        _dialogEventProxy: function(evt){
            var target = evt.target;
            switch(target.dataset.action){
                case 'cancel':
                    this.hide(evt);
                    if(this.cancelHandler){
                        this.cancelHandler.call(target);
                    }
                    break;
                case 'confirm':
                    this.hide(evt);
                    if(this.confirmHandler){
                        this.confirmHandler.call(target);
                    }
                    break;
            }
        }
    }
    window.addEventListener('DOMContentLoaded', function(){
        var confirm = new Dialog().init(),
            alert = new Dialog({type: 'alert'});
        this.showConfirm = confirm.show.bind(confirm);
        this.hideConfirm = confirm.hide.bind(confirm);
        this.showAlert = alert.show.bind(alert);
        this.hideAlert = alert.hide.bind(alert);
        document.body.addEventListener('click', function(evt){
            var target = evt.target, tmp;
            if(target.dataset.toggle && target.dataset.toggle === 'pop'){
                // toggle
                document.querySelector(target.dataset.target).style.display = 'block';
            }else if(target.dataset.action && target.dataset.action === 'close'){
                // close
                tmp = target;
                while(true){
                    if(tmp.nodeType === 9){
                        break;
                    }
                    tmp = tmp.parentNode;
                    if(tmp.classList && tmp.classList.contains('pop')){
                        tmp.style.display = 'none';
                        break;
                    }
                }
            }
        }, false);
    }, false);
})(window);