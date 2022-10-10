import foodsData from "./data.js"

const paymentForm = document.getElementById("pay-money")

document.body.addEventListener("click", function(e){
    if (e.target.dataset.add){
        listenForAddFood(e.target.dataset.add)
    } else if(e.target.dataset.remove){
        listenForRemoveFood(e.target.dataset.remove)
    } else if(e.target.id === "complete-order-btn"){
        listenForOrderCompleted()
    }
})

paymentForm.addEventListener("submit", function(e){
    e.preventDefault()

    const paymentDetails = new FormData(paymentForm)
    const payerName = paymentDetails.get("fullname")

    document.getElementById("processing").innerHTML = `    
        <div id="loading">
            <img src="./loading.gif" alt="processing">
        </div>
    `

    document.getElementById("pay-btn").classList.add("greyout")
    document.getElementById("pay-btn").style.cursor = "not-allowed"

    setTimeout(() =>{
        document.getElementById("order-summary-stage").innerHTML = `
        <div class="success-message" id="success-message">
            <div class="success-inner">
                <p>Thanks <span id="payer-name">${payerName}</span>, your order is on its way!</p>
            </div>
        </div>
        `
        document.getElementById("popup-outer").style.display = "none"
        document.getElementById("success-message").style.display = "block"
        document.getElementById("order-summary-stage").style.marginBottom = "45vh"
    }, 4000)
})


const selectedFoodsPricesArray = [0]
const selectedFoodsArray = []


function getOrderSummaryHtml(){
    let orderSummaryHtml = " "
    let totalItemsOrdered = " "

    const selectedFoodsPriceSum = selectedFoodsPricesArray.reduce(function(total, presentVal){
        return total + presentVal
    })

    selectedFoodsArray.forEach(function(item){
        totalItemsOrdered +=`
        <div class="order-details">
            <div class="food-name">${item.foodName}<span class="remove-order" data-remove="${item.uuid}">remove</span> </div>
            <div id="price-tag">₦${item.price}</div>
        </div>  
        `
    })

    orderSummaryHtml = `
    <div class="order-summary">
        <h4>Your Order</h4>
        <div class="order-details-wrapper" id="order-details-wrapper">
            ${totalItemsOrdered}
        </div>
        <div class="total">
            <div>Total price</div>
            <div class="total-tag">₦${selectedFoodsPriceSum}</div>
        </div>
        <button class="complete-order-btn" id="complete-order-btn">Complete Order</button>
    </div>
    `

    return orderSummaryHtml
}

function renderOrderSummary(){
    document.getElementById("order-summary-stage").innerHTML = getOrderSummaryHtml()
    document.getElementById("order-summary-stage").style.display = "block"

    if (selectedFoodsArray.length > 1){
        document.getElementById("foods-stage").style.marginBottom = "35vh"
    } 
    if(selectedFoodsArray.length > 5){
        document.getElementById("foods-stage").style.marginBottom = "45vh"
    }
    if(selectedFoodsArray.length > 9){
        document.getElementById("foods-stage").style.marginBottom = "55vh"
    }
}

function listenForAddFood(foodId){

    const intendedFood = foodsData.filter(function(food){
            return food.uuid === foodId
    })[0]
    
    selectedFoodsArray.push(intendedFood)
    
    selectedFoodsPricesArray.push(intendedFood.price)

    renderOrderSummary()
}

function listenForRemoveFood(foodId){
    const intendedObject = selectedFoodsArray.filter(function(food){
        return food.uuid === foodId
    })[0]

    const checkArray = (x) => {
        return x === intendedObject
    }

    const foodIndex = selectedFoodsArray.findIndex(checkArray)

    selectedFoodsArray.splice(foodIndex, 1)

    const priceIndex = selectedFoodsPricesArray.indexOf(intendedObject.price)
    selectedFoodsPricesArray.splice(priceIndex, 1)
    
    renderOrderSummary()
}

function listenForOrderCompleted(){
    const selectedFoodsPriceSum = selectedFoodsPricesArray.reduce(function(total, presentVal){
        return total + presentVal
    })

    document.getElementById("pay-btn").innerText = `Pay ₦${selectedFoodsPriceSum}`
    document.getElementById("popup-outer").style.display = "block"
}

function setFoodsHtml(){
    let foodsHtml = ""

    foodsData.forEach(function(food){
        foodsHtml += `
        <div class="foods-wrapper">
            <div class="food-sample">
                <img src="./${food.image}" class="food-image">
            </div>
            <div class="texts-action">
                <div class="texts">
                    <div class="food-details">
                        <p>${food.foodName}</p>
                        <p class="description-texts">${food.foodDescription}</p>
                    </div>
                    <div class="food-price">
                        <p> ₦${food.price}</p>
                    </div>
                </div>
                <div class="action">
                    <button class="add-btn" data-add="${food.uuid}">+</button>
                </div>
            </div>
        </div>
        `
    })

    return foodsHtml
}

function renderFoods(){
    document.getElementById("foods-stage").innerHTML = setFoodsHtml()
}

renderFoods()