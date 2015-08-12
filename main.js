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

createArray = function(){
    var arrayPage = [];
    var items = 50;
    for( var i = 0; i < items; i++){
        arrayPage.push(i+1);
    }
    return arrayPage;
};

var content = document.querySelector('.select-template');

content.innerHTML = tmpl('optionsSelect', {
    items: ['red', 'blue', 'red', 'yellow', 'black'],
    selected: 'yellow'
});

var results = document.querySelector('.pagination');

render = function(newPage){
    newPage = newPage || 2;
    itemsLength = createArray();
    console.log(newPage);
    results.innerHTML = tmpl('paginationTemplate', {
        items: itemsLength,
        currentPage: newPage,
        start: Math.max(newPage - 2, 1),
        end: Math.min(newPage + 1, itemsLength.length-1)
    });
};

render();

results.addEventListener('click',function(e){
    if(e.srcElement.tagName.toLocaleLowerCase() === 'a'){
        render(parseInt(e.srcElement.innerHTML, 10));
    }
});

