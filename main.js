(function(){
    var cache = {};

    this.tmpl = function tmpl(str, data){
        // Выяснить, мы получаем шаблон или нам нужно его загрузить
        // обязательно закешировать результат
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Сгенерировать (и закешировать) функцию,
            // которая будет служить генератором шаблонов
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Сделать данные доступными локально при помощи with(){}
                "with(obj){p.push('" +

                    // Превратить шаблон в чистый JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        // простейший карринг(термин функ. прог. - прим. пер.)
        // для пользователя
        return data ? fn( data ) : fn;
    };
})();


function extend(obj1, obj2){
    if(obj2 && obj1){
        Object.keys(obj2).forEach(function(key){
            if(typeof obj1[key] === 'object'){
                obj1[key] = extend(obj1[key], obj2[key]);
            }else{
                obj1[key] = obj2[key];
            }
        });
    }
    return obj1;
}



function Pagination(options){
    this.options = extend({
        recordsPerPage: 2,
        elemArray: []
    }, options);
    this.init();

}
Pagination.prototype = {

    init: function() {
        this.findElements();
        this.render();
        this.addHandler();
    },
    findElements: function(){
        this.results = document.querySelector('.pagination');
    },
    createArray: function() {
        this.arrayPage = [];
        this.items = this.numPages();
        for( var i = 0; i < this.items; i++){
            this.arrayPage.push(i+1);
        }
        return this.arrayPage;
    },
    numPages: function(){
        return Math.ceil(this.options.elemArray.length / this.options.recordsPerPage);
    },
    getCurrentData: function(){
        var end =  Math.min((this.currentPage * this.options.recordsPerPage), this.options.elemArray.length),
            start = (this.currentPage - 1)* this.options.recordsPerPage;
        //console.log(start, end, this.options.elemArray, this.options.recordsPerPage, this.currentPage)

        return this.options.elemArray.slice(start, end);
    },
    render: function(newPage){
        this.currentPage = newPage || 1;
        this.itemsLength = this.createArray();
        this.results.innerHTML = tmpl('paginationTemplate', {
            items: this.itemsLength,
            currentPage: this.currentPage,
            start: Math.max(this.currentPage - 2, 1),
            end: Math.min(this.currentPage + 1, this.itemsLength.length - 1)
        });
        typeof this.options.onChange === 'function' && this.options.onChange(this.getCurrentData());
    },
    addHandler: function(){
        var self = this;
        this.results.addEventListener('click',function(e){
            if(e.srcElement.tagName.toLocaleLowerCase() === 'a'){
                self.render(parseInt(e.srcElement.innerHTML, 10));
            }
        });
    },
    setData: function(data){
        this.options.elemArray = data;
        this.currentPage = 1;
        this.render();
    }

};
var information = document.querySelector('.information');
var pagination = new Pagination({
    elemArray: [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen'
    ],
    onChange: function(data){
        information.innerHTML = tmpl('info', {
            elements: data
        });
    }
});

setTimeout(function(){
    pagination.setData([
        'one',
        'two',
        'three',
        'four',
        'five'
    ]);
}, 5000);
