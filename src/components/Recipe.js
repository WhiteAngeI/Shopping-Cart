import React, { Component } from 'react';
import { connect } from 'react-redux';


class Recipe extends Component{

    handleDiscountToken = (e) =>{
       if(e.target.type === 'text'){
            if(e.target.value === this.props.discountToken) {
                this.props.addDiscount();
                e.target.type = 'checkbox'
                e.target.checked = true
            }
       }else if(e.target.type === 'checkbox' && e.target.checked === false) {
           this.props.subtractDiscount();
           e.target.value = ''
           e.target.type = 'text'
       }
    }

    render(){
        return(
            <div className="container">
                <div className="collection">
                    <li className="collection-item">
                            <label>
                                <input type='text' ref="discount" onChange={this.handleDiscountToken} />
                                <span>Discount(50p)</span>
                            </label>
                        </li>
                        <li className="collection-item"><b>Total: £ {this.props.total.toFixed(2)}</b></li>
                        {this.props.discountInfo.map((item, i) => (<li className="collection-item" key={'discount' + i}><b>{item.name}</b></li>))}
                        {this.props.bundleInfo.map((item,i) => <li className="collection-item" key={'bundle' + i}><b>{item.name}</b></li>)}
                        <li className="collection-item"><b>Total price: {this.props.totalPrice.toFixed(2)} £</b></li>
                    </div>
                    <div className="checkout">
                        <button disabled={(this.props.total.toFixed(2) <= 0)} className="waves-effect orange darken-4 btn">Checkout</button>
                    </div>
                 </div>
        )
    }
}


const mapStateToProps = (state)=> {
    state.totalDiscounts = 0
    state.discountsInfo = []
    state.bundleInfo = []
    state.addedItems.forEach(function (addedItem) {
        const discountRates = state.discounts.find(({itemId}) => itemId === addedItem.id)
        const bundleRates = state.bundles.find(({bundleItemId}) => bundleItemId === addedItem.id)

            if (discountRates) {
                if (new Date() < new Date(discountRates.endDate)) {
                    let discount = addedItem.quantity * addedItem.price * (discountRates.discountPercent/100)
                    state.totalDiscounts = state.totalDiscounts + discount
                    state.discountsInfo[addedItem.id] = {name: discountRates.name + ' - £' + discount.toFixed(2)}
                }
            }

            if(bundleRates) {
                let bundleDiscountItem = state.addedItems.find(({id}) => id === bundleRates.itemId)
                if(bundleDiscountItem) {
                    let roundedItemsAmount = Math.floor(addedItem.quantity/bundleRates.bundleItemAmount)
                    for(let i=1; i <= roundedItemsAmount; i++ ){
                        // i is discount amount
                        if (i <= bundleDiscountItem.quantity) {
                            let discount = bundleDiscountItem.price * (bundleRates.discountPercent/100)
                            state.totalDiscounts = state.totalDiscounts + discount
                            state.bundleInfo.push (
                                {name: bundleRates.name + ' - £' + discount.toFixed(2)}
                            )
                        }
                    }
                }
            }
    })

    return {
        total: state.total,
        discountInfo: state.discountsInfo.length > 0 ? state.discountsInfo : [{name:'(No discounts available)'}],
        totalPrice: state.total - state.totalDiscounts,
        bundleInfo: state.bundleInfo.length > 0 ? state.bundleInfo : [{name:'(No offers available)'}],
        discountToken: state.discountToken
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        addDiscount: ()=>{dispatch({type: 'ADD_DISCOUNT'})},
        subtractDiscount: ()=>{dispatch({type: 'SUB_DISCOUNT'})},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Recipe)
