import Item1 from '../../images/item1.png'
import Item2 from '../../images/item2.jpg'
import Item3 from '../../images/item3.jpg'
import Item4 from '../../images/item4.png'

import {
    ADD_TO_CART,
    REMOVE_ITEM,
    SUB_QUANTITY,
    ADD_QUANTITY,
    ADD_DISCOUNT,

} from '../actions/action-types/cart-actions'

const discount = 0.5;

const initState = {
    items: [
        {id:1,title:'Apples', desc: "An apple is an edible fruit produced by an apple tree (Malus domestica). Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus. ", price:1,img:Item1},
        {id:2,title:'Milk', desc: "Milk is a nutrient-rich liquid food produced by the mammary glands of mammals. It is the primary source of nutrition for young mammals, including breastfed human infants before they are able to digest solid food.",price:1.3,img: Item3},
        {id:3,title:'Bread', desc: "Bread is a staple food prepared from a dough of flour and water, usually by baking.", price:0.8,img: Item2},
        {id:4,title:'Soup', desc: "Soup is a primarily liquid food, generally served warm or hot (but may be cool or cold), that is made by combining ingredients of meat or vegetables with stock, milk, or water. ", price:0.65,img:Item4},
    ],
    discountToken: 'token',
    discounts: [
        {name: "Apples 10% off", itemId:1, endDate:"July 4, 2021 22:00:00", discountPercent:10},
    ],
    bundles: [{name: "For every two soup bread 50% off", itemId:3, discountPercent:50, bundleItemId:4, bundleItemAmount:2}],

    addedItems:[],

    total: 0,
    totalDiscounts: 0,
    totalPrice: 0,
    cartQuantity: 0

}

const cartReducer= (state = initState,action)=>{
    //INSIDE HOME COMPONENT
    if(action.type === ADD_TO_CART){
         state.cartQuantity += 1
          let addedItem = state.items.find(item => item.id === action.id)
          //check if the action id exists in the addedItems
         let existed_item = state.addedItems.find(item => action.id === item.id)
        if(existed_item) {
            addedItem.quantity += 1
            return {
                ...state,
                total: state.total + addedItem.price,
            }
        }else{
            addedItem.quantity = 1;
            //calculating the total
            let newTotal = state.total + addedItem.price
            return{
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total : newTotal,
            }
        }
    }
    if(action.type === REMOVE_ITEM){

        let itemToRemove= state.addedItems.find(item=> action.id === item.id)
        let new_items = state.addedItems.filter(item=> action.id !== item.id)
        state.cartQuantity -=  itemToRemove.quantity
        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity )

        return{
            ...state,
            addedItems: new_items,
            total: newTotal
        }
    }
    //INSIDE CART COMPONENT
    if(action.type=== ADD_QUANTITY){
        let addedItem = state.items.find(item=> item.id === action.id)
        addedItem.quantity += 1
        state.cartQuantity += 1
        let newTotal = state.total + addedItem.price
        return{
            ...state,
            total: newTotal
        }
    }

    if(action.type=== SUB_QUANTITY){
        let addedItem = state.items.find(item=> item.id === action.id)
        //if the qt == 0 then it should be removed
        if(addedItem.quantity === 1){
            state.cartQuantity -= 1
            let new_items = state.addedItems.filter(item=>item.id !== action.id)
            let newTotal = state.total - addedItem.price
            return{
                ...state,
                addedItems: new_items,
                total: newTotal
            }
        }
        else {
            state.cartQuantity -= 1
            addedItem.quantity -= 1
            let newTotal = state.total - addedItem.price
            return{
                ...state,
                total: newTotal
            }
        }
    }

    if(action.type === ADD_DISCOUNT){
            return{
                ...state,
                total: state.total - discount
            }
    }

    if(action.type=== 'SUB_DISCOUNT'){
            return{
                ...state,
                total: state.total + discount
            }
  }

  else{
    return state
    }

}

export default cartReducer;
