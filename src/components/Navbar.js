import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";



class Navbar extends Component {

    render(){

        return (
            <nav className="nav-wrapper background-color light-green darken-1">
                <div className="container">
                    <Link to="/" className="brand-logo">Shopping</Link>
                    <ul className="right">
                        <li><Link to="/">Shop</Link></li>
                        <li><Link to="/cart">My cart</Link></li>
                        <li><Link to="/cart"><i className="material-icons">shopping_cart</i></Link></li>
                        <li><Link to="/cart">{this.props.cartQuantity}</Link></li>
                    </ul>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        cartQuantity: state.cartQuantity
    }
}



export default connect(mapStateToProps)(Navbar)
