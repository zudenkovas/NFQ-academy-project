var orderPaginationDataElement = $('#data-container');
var orderPaginationContainerElement = $('#pagination-container');
var resultElement = document.getElementById('result');
var searchNameElement = document.getElementById('searchname');
var clientEmailElement = document.getElementById('email');
var addressElement = document.getElementById('address');
var orderIdElement = document.getElementById('orderid');
var newOrdersElement = document.getElementById('neworders')
var activeOrdersElement = document.getElementById('activeorders');
var completeOrdersElement = document.getElementById('completeorders');
var orderPriceLowElement = document.getElementById('orderpricelow');
var orderPriceHighElement = document.getElementById('orderpricehigh');
var orderfilterBtnElement = document.getElementById('ordersbuttonSubmit');
var orderclearBtnElement = document.getElementById('ordersbuttonClear');

var orderlist, ordersearchResult;
var orderFilterResult = [];

$.getJSON("http://localhost:8080/resources/orders.json", function (data) {
    orderlist = data;
    ordersearchResult = data;
    renderOrders(data)

});

orderclearBtnElement.addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('form').reset();
    renderOrders(orderlist);
});

orderfilterBtnElement.addEventListener('click', function (event) {
    event.preventDefault();

    var searchNameElementValue = searchNameElement.value;
    var clientEmailElementValue = clientEmailElement.value;
    var clientAddressElementValue = addressElement.value;
    var orderIdElementValue = orderIdElement.value;
    var orderStatusSelectorArray = [activeOrdersElement.checked, newOrdersElement.checked, completeOrdersElement.checked]
    var orderStatusArray = ['Active', 'New', 'Complete'];
    var activeOrdersElementBool = activeOrdersElement.checked;
    var newOrdersElementBool = newOrdersElement.checked;
    var completeOrdersElementBool = completeOrdersElement.checked;
    var orderPriceLowElementValue = orderPriceLowElement.value;
    var orderPriceHighElementValue = orderPriceHighElement.value;
    console.log(orderStatusSelectorArray)


    ordersearchResult = orderlist.filter(function (order) {
        //debugger;
        return order.name.toLowerCase().indexOf(searchNameElementValue.toLowerCase()) > -1
    });

    ordersearchResult = ordersearchResult.filter(function (order) {
        return order.email.toLowerCase().indexOf(clientEmailElementValue.toLowerCase()) > -1
    });

    ordersearchResult = ordersearchResult.filter(function (order) {
        return order.address.toLowerCase().indexOf(clientAddressElementValue.toLowerCase()) > -1
    });

    ordersearchResult = ordersearchResult.filter(function (order) {
        if (orderIdElementValue) {
            return order.order_id == orderIdElementValue
        } else { return true }


    });

    ordersearchResult = ordersearchResult.filter(function (order) {
        for (var i = 0; i < orderStatusArray.length; i++) {
            if (orderStatusSelectorArray[i] == true && order.order_status == orderStatusArray[i]) {
                return true
            }
        }
    });


    ordersearchResult = ordersearchResult.filter(function (order) {
        if (orderPriceHighElementValue && orderPriceLowElementValue) {
            return orderPriceLowElementValue <= Number(order.order_price.substr(1)) && Number(orderPriceHighElementValue >= order.order_price.substr(1));
        } else if (orderPriceHighElementValue && !orderPriceLowElementValue) {
            return orderPriceHighElementValue >= Number(order.order_price.substr(1));

        } else if (!orderPriceHighElementValue && orderPriceLowElementValue)
        {return orderPriceLowElementValue <= Number(order.order_price.substr(1))
        } else {return ordersearchResult};

    });







    console.log(ordersearchResult)
    renderOrders(ordersearchResult);

});




function renderOrders(orderList) {
    var orderItems = [];
    console.log(orderList.length)
    if (orderList.length > 0) {
        for (var i = 0; i < orderList.length; i++) {
            if (orderList[i].order_status == 'New') {
                orderItems.push(`
                <div class="album row">
                <div class="col-lg-2">
                <img width="100px" src="${orderList[i].picture}">
                </div>
                <div class="col-lg-10">
                <div>Order id: ${orderList[i].order_id} <span class="badge badge-pill badge-danger">New</span></div>
                <h3>${orderList[i].name}</h2>
                <div class="description">${orderList[i].email}</div>
                <div class="description">${orderList[i].phone}</div>
                <div class="description">${orderList[i].address}</div>
                <div class="price">${orderList[i].order_price}</div>
        </div>   
    </div>
    <hr>
`)
            } else if (orderList[i].order_status == 'Active') {
                orderItems.push(`
                <div class="album row">
                <div class="col-lg-2">
                <img width="100px" src="${orderList[i].picture}">
                </div>
                <div class="col-lg-10">
                <div>Order id: ${orderList[i].order_id} <span class="badge badge-pill badge-warning">Active</span></div>
                <h3>${orderList[i].name}</h2>
                <div class="description">${orderList[i].email}</div>
                <div class="description">${orderList[i].phone}</div>
                <div class="description">${orderList[i].address}</div>
                <div class="price">${orderList[i].order_price}</div>
    
    </div>   
</div>
<hr>
`)
            } else if (orderList[i].order_status == 'Complete') {
                orderItems.push(`
                <div class="album row">
                <div class="col-lg-2">
                <img width="100px" src="${orderList[i].picture}">
                </div>
                <div class="col-lg-10">
                <div>Order id: ${orderList[i].order_id}     <span class="badge badge-pill badge-success">Complete</span></div>
                <h3>${orderList[i].name}</h2>
                <div class="description">${orderList[i].email}</div>
                <div class="description">${orderList[i].phone}</div>
                <div class="description">${orderList[i].address}</div>
                <div class="price">${orderList[i].order_price}</div>

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


        orderPaginationContainerElement.pagination({
            dataSource: orderItems,
            pageSize: 4,
            callback: function (data, pagination) {
                var html = simpleTemplating(data);
                orderPaginationDataElement.html(html);

            }
        })
    } else if (orderList.length == 0) {

        orderItems = ['<div class="alert alert-danger" role="alert"> Sorry, there are no products according to your search parameters.</div>']
        function simpleTemplating(data) {
            var html = '<div class="alert alert-danger" role="alert"> Sorry, there are no products according to your search parameters.</div>';

            return html;
        };


        orderPaginationContainerElement.pagination({
            dataSource: orderItems,
            pageSize: 4,
            callback: function (data, pagination) {
                var html = simpleTemplating(data);
                orderPaginationDataElement.html(html);

            }
        })

            ;


    }


}



