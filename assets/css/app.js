const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function validator(options) {

    function getParentElement(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    function validate(inputElement, rule) {
         
        var errorMessage;
        var errorText = getParentElement(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        
        // lấy rules của selector
        var rules = selectorRules[rule.selector];

        console.log(rules);

        // lặp qua từng rules và kiểm tra
        for(var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);

            // nếu có lỗi dừng việc kiểm tra
            if (errorMessage) break;
        }

        if(errorMessage) {
            errorText.innerHTML = errorMessage;
                getParentElement(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorText.innerHTML = '';
            getParentElement(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        console.log(inputElement.parentElement.querySelector(options.errorSelector));

        // convert errorMessage to boolean
        return !errorMessage;

    }

        var formElement = document.querySelector(options.form)
            
        if(formElement) {

            // submit form
            formElement.onsubmit = function(e) {
                e.preventDefault();

                var isFormValid = true;

                //lặp qua từng rules và validate
                options.rules.forEach(function(rule) {
                    
                    var inputElement = formElement.querySelector(rule.selector);
                    var isVaild = validate(inputElement, rule);
                    if(!isVaild) {
                        isFormValid = false; 
                    }
                });

                
                if(isFormValid) {
                    if ( typeof options.onSubmit === 'function') {
                        var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                        console.log(enableInputs);
                        
                        var formValues = Array.from(enableInputs).reduce(function(value, input){
                            value[input.name] = input.value;
                            return value;

                        }, {}); 
                        options.onSubmit(formValues)
                   }
                }      
            }

            // lặp qua mỗi rule và xử lý (lắng nghe sự kiện)
            options.rules.forEach(function(rule){

                // lưu lại các rules cho mỗi input
                if(Array.isArray(selectorRules[rule.selector])) {
                    selectorRules[rule.selector].push(rule.test);
                } else {
                    selectorRules[rule.selector] = [rule.test];
                }

                var inputElement = formElement.querySelector(rule.selector);
                
                // xử lý khi ng dùng blur ra ngoài input
                if(inputElement) {
                    inputElement.onblur = function() {
                        validate(inputElement, rule);
                    }
                }

                // xử lý khi ng dùng nhập vào input
                inputElement.oninput = function() {
                    var errorText = getParentElement(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorText.innerHTML = '';
                    getParentElement(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            });
        }
    }

validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : 'Vui lòng điền vào mục này!';
            //trim -> xoá bỏ dấu cách ở 2 đầu
            // nếu người dùng nhập vào trả về undefined, không nhập trả về Vui lòng điền vào mục này.!
        }
    }
}

validator.isEmail = function(selector) {
    return {
        selector,
        test: function(value) {
            // kiểm tra ng dùng nhập đúng email không? regext js email
            regext = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            return regext.test(value) ? undefined : 'Checked your information!';
        }
    }
}

validator.minLength = function(selector, min) {
    return {
        selector,
        test: function(value) {
            return value.length >= min ? undefined : 'Vui lòng điền vào mục này!';
        }
    }
}

validator.confirmPassword = function(selector, getPassword, message) {
    return {
        selector: selector,
        test: function(value) {
            // tương tự với những rules khác 
        return value === getPassword() ? undefined : message || 'Vui lòng điền vào mục này!';
        }
    }
}

const btnRegister = $('.btn-register');
const btnLogin = $('.btn-login');

window.addEventListener('load', () => {
    btnLogin.addEventListener('click', () => {
        $('.auth-form__login').classList.add('active');
        $('.auth-form__register').classList.remove('active');

    });

    btnRegister.addEventListener('click', () => {
        $('.auth-form__register').classList.add('active');
        $('.auth-form__login').classList.remove('active');
    });

})