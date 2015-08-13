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
        recordsPerPage: 1,
        elemArray: [
            'one'
        ]
    }, options);
    this.init();

}
Pagination.prototype = {

    init: function() {
        this.findElements();
        this.changePage(1);
        this.addHandler();
        this.render();
    },
    findElements: function(){
        this.information = document.querySelector('.information');
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
    changePage: function(page){
        this.elements = [];
        this.end =  Math.min((page * this.options.recordsPerPage), this.options.elemArray.length);
        this.start = (page - 1)* this.options.recordsPerPage;
        this.elements = this.options.elemArray.slice(this.start, this.end);
        this.information.innerHTML = tmpl('info', {
            elements: this.elements
        });
    },
    render: function(newPage){
        newPage = newPage || 1;
        this.itemsLength = this.createArray();
        this.results.innerHTML = tmpl('paginationTemplate', {
            items: this.itemsLength,
            currentPage: newPage,
            start: Math.max(newPage - 2, 1),
            end: Math.min(newPage + 1, this.itemsLength.length - 1)
        });
    },
    addHandler: function(){
        var self = this;
        this.results.addEventListener('click',function(e){
            if(e.srcElement.tagName.toLocaleLowerCase() === 'a'){
                self.render(parseInt(e.srcElement.innerHTML, 10));
                self.changePage(parseInt(e.srcElement.innerHTML, 10));
            }
        });
    }
};
new Pagination({
    recordsPerPage: 2,
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
    ]
});
