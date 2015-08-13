(function(){
    var cache = {};

    this.tmpl = function tmpl(str, data){
        // ��������, �� �������� ������ ��� ��� ����� ��� ���������
        // ����������� ������������ ���������
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // ������������� (� ������������) �������,
            // ������� ����� ������� ����������� ��������
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // ������� ������ ���������� �������� ��� ������ with(){}
                "with(obj){p.push('" +

                    // ���������� ������ � ������ JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        // ���������� �������(������ ����. ����. - ����. ���.)
        // ��� ������������
        return data ? fn( data ) : fn;
    };
})();

createArray = function(){
    var arrayPage = [];
    var items = numPages();
    for( var i = 0; i < items; i++){
        arrayPage.push(i+1);
    }
    return arrayPage;
};


var information = document.querySelector('.information');
var recordsPerPage = 2;
var elemArray = [
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
];

numPages = function(){
    return Math.ceil(elemArray.length / recordsPerPage);
};

changePage = function(page){
    var elements = [];
    var end =  Math.min((page * recordsPerPage), elemArray.length);
    console.log(end);
    elements = elemArray.slice((page - 1)* recordsPerPage, end);
    information.innerHTML = tmpl('info', {
        elements: elements
    });
};

changePage(1);

var results = document.querySelector('.pagination');

render = function(newPage){
    newPage = newPage || 1;
    itemsLength = createArray();
    results.innerHTML = tmpl('paginationTemplate', {
        items: itemsLength,
        currentPage: newPage,
        start: Math.max(newPage - 2, 1),
        end: Math.min(newPage + 1, itemsLength.length - 1)
    });
};
render();

results.addEventListener('click',function(e){
    if(e.srcElement.tagName.toLocaleLowerCase() === 'a'){
        render(parseInt(e.srcElement.innerHTML, 10));
        changePage(parseInt(e.srcElement.innerHTML, 10));
    }
});

