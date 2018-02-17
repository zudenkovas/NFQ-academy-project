var paginationDataElement = $('#data-container');
var paginationContainerElement = $('#pagination-container');
var resultElement = document.getElementById('result');
var searchElement = document.getElementById('search');
var priceLowElement = document.getElementById('pricelow');
var priceHighElement = document.getElementById('pricehigh');
var allStockElement = document.getElementById('allstock')
var inStockElement = document.getElementById('instock');
var outOfStockElement = document.getElementById('outofstock');
var filterBtnElement = document.getElementById('buttonSubmit');
var clearBtnElement = document.getElementById('buttonClear');
var productList, searchResult;

$.getJSON("http://localhost:8080/resources/products.json", function (data) {
    productList = data;
    searchResult = data;
    renderProducts(data)
});

clearBtnElement.addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('form').reset();
    renderProducts(productList);
});

filterBtnElement.addEventListener('click', function (event) {
    event.preventDefault();

    var searchElementValue = searchElement.value;
    var priceLowElementValue = priceLowElement.value;
    var priceHighElementValue = priceHighElement.value;

    searchResult = productList.filter(function (product) {
        return product.product_name.toLowerCase().indexOf(searchElementValue.toLowerCase()) > -1;
    });

    searchResult = searchResult.filter(function (product) {
        if (priceHighElementValue && priceLowElementValue) {
            return priceLowElementValue <= Number(product.price.substr(1)) && Number(priceHighElementValue >= product.price.substr(1));
        } else if (priceHighElementValue && !priceLowElementValue) {
            return priceHighElementValue >= Number(product.price.substr(1));
        } else if (!priceHighElementValue && priceLowElementValue) {
            return priceLowElementValue <= Number(product.price.substr(1))
        } else { return searchResult };
    });

    searchResult = searchResult.filter(function (product) {
        if (inStockElement.checked) {
            return product.in_stock == true;
        } else if (outOfStockElement.checked) {
            return product.in_stock == false;
        } else if (allStockElement.checked) {
            return searchResult;
        }
    });
    renderProducts(searchResult);
});

function renderProducts(productList) {
    var order_items = [];
    console.log(productList.length)
    if (productList.length > 0) {
        for (var i = 0; i < productList.length; i++) {
            if (productList[i].in_stock == true) {
                order_items.push(`
    <div class="album row">
        <div class="col-lg-2">
        <img width="100px" src="${productList[i].avatar}">
        </div>
        <div class="col-lg-10">
        <h3>${productList[i].product_name}</h2>
        <div class="description">${productList[i].product_description}</div>
        <div class="price">${productList[i].price}</div>
        <span class="badge badge-pill badge-success">In Stock</span>
        </div>   
    </div>
    <hr>
`)
            } else {
                order_items.push(`
<div class="album row">
    <div class="col-lg-2">
    <img width="100px" src="${productList[i].avatar}">
    </div>
    <div class="col-lg-10">
    <h3>${productList[i].product_name}</h2>
    <div class="description">${productList[i].product_description}</div>
    <div class="price">${productList[i].price}</div>
    <span class="badge badge-pill badge-danger">Out of Stock</span>
    </div>   
</div>
<hr>
`)
            };
        };
        function simpleTemplating(data) {
            var html = '<ul>';
            $.each(data, function (index, item) {
                html += '<li class="list">' + item + '</li>';
            });
            html += '</ul>';
            return html;
        };

        paginationContainerElement.pagination({
            dataSource: order_items,
            pageSize: 4,
            callback: function (data, pagination) {
                var html = simpleTemplating(data);
                paginationDataElement.html(html);
            }
        })
    } else if (productList.length == 0) {
        order_items = ['<div class="alert alert-danger" role="alert"> Sorry, there are no products according to your search parameters.</div>']
        function simpleTemplating(data) {
            var html = '<div class="alert alert-danger" role="alert"> Sorry, there are no products according to your search parameters.</div>';
            return html;
        };

        paginationContainerElement.pagination({
            dataSource: order_items,
            pageSize: 4,
            callback: function (data, pagination) {
                var html = simpleTemplating(data);
                paginationDataElement.html(html);
            }
        });
    }
}
