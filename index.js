const { request, response } = require('express');
const express = require('express');
const uuid = require('uuid');

const port = 3000;
const app = express();
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id);

    if (index < 0) {
        return response.status(404).json({ message: "order not found" });
    }

    request.orderId = id;
    request.orderIndex = index;

    next()
}

const requestUrl = (request, response, next) => {
    const method = request.method;
    const url = request.url

    console.log(`This request have using the method ${method}, and have using the url ${url} `)

    next();
}

app.post('/order', requestUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const clientsOrder = { id: uuid.v4(), order, clientName, price, status: "em preparação" }

    orders.push(clientsOrder);
    console.log(request);

    return response.status(201).json(orders);
})

app.get('/order', requestUrl, (request, response) => {
    return response.json(orders);
});

app.put('/order/:id', checkOrderId, requestUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const id = request.orderId;
    const index = request.orderIndex

    const updateOrder = { id, order, clientName, price, status: "em preparação" };

    orders[index] = updateOrder;

    return response.json(updateOrder);
})

app.delete('/order/:id', checkOrderId, requestUrl, (request, response) => {
    const index = request.orderIndex;

    orders.splice(index, 1);

    return response.status(204).json();
})

app.get('/order/:id', checkOrderId, requestUrl, (request, response) => {
    const index = request.orderIndex

    const findOrder = orders[index];

    return response.json(findOrder);
})

app.patch('/order/:id', checkOrderId, requestUrl, (request, response) => {
    const index = request.orderIndex
    const order = orders[index];

    order.status = " pedido pronto"

    return response.json(order);

})

app.listen(port, () => {
    console.log(`Server started on port ${port} 🚀`);
});