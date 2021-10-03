import React from 'react';
import Cart from './Cart';
import Navbar from './Navbar';
import * as firebase from 'firebase'

class App extends React.Component {

  constructor () {   
    super();
    this.state = {
      products: [],
      loading: true,
    }
    // this.increaseQuantity = this.increaseQuantity.bind(this);
    // this.testing();
    this.db = firebase.firestore();
  }
  //called after app is mounted
  // componentDidMount() {
  //   firebase
  //     .firestore()
  //     .collection('products')
  //     .get()
  //     .then((snapshot) => {
  //       const products = snapshot.docs.map((doc)=>{
  //         const data = doc.data();
  //         data['id'] = doc.id;
  //         return data;
  //       })
  //       this.setState({
  //         products,
  //         loading: false,
  //       })
  //     })
  // } 

  componentDidMount() {
    this.db
      .collection('products')
      .onSnapshot((snapshot) => { //onSnapshot is an event listener and called whenever any change in db/products collection(observer)
        const products = snapshot.docs.map((doc)=>{
          const data = doc.data();
          data['id'] = doc.id;
          return data;
        })
        this.setState({
          products,
          loading: false,
        })
      }) 
      //attaches a listener for query snapshot events(whenever change in db)
  } 

  
  

  handleIncreaseQuantity = (product) => {
    const { products } = this.state;
    const index = products.indexOf(product);

    products[index].qty += 1;

    this.setState({
      products
    })
  }
  handleDecreaseQuantity = (product) => {
    const { products } = this.state;
    const index = products.indexOf(product);

    if (products[index].qty === 0) {
      return;
    }

    products[index].qty -= 1;

    this.setState({
      products
    })
  }
  handleDeleteProduct = (id) => {
    const { products } = this.state;

    const items = products.filter((item) => item.id !== id); // [{}]

    this.setState({
      products: items
    })
  }

  getCartCount = () => {
    const { products } = this.state;

    let count = 0;

    products.forEach((product) => {
      count += product.qty;
    })

    return count;
  }

  getCartTotal = () => {
    const { products } = this.state;

    let cartTotal = 0;

    products.map(product => {
      if(product.qty>0){
      cartTotal = cartTotal + product.qty * product.price
      }
      return '';
    });
    return cartTotal;
  }

  addProduct = ()=>{
    this.db
        .collection('products')
        .add({
          img:'',
          price:900,
          qty:3,
          title: 'Washing Machine',
        }) //in the promise returned we will get the reference to the object added
        .then((docRef)=>{
          console.log('product added' ,docRef);
        })
        .catch((error)=>{
          console.log('error ', error);
        })

  }

  render () {
    const { products, loading } = this.state;
    return (
      <div className="App">
        <Navbar count={this.getCartCount()} />
        <button style={{padding:20, fontSize:20}} onClick={this.addProduct}>Add a product</button>
        <Cart
          onIncreaseQuantity={this.handleIncreaseQuantity}
          onDecreaseQuantity={this.handleDecreaseQuantity}
          onDeleteProduct={this.handleDeleteProduct}
          products={products}
        />
        {loading && <h1>Loading Products...</h1>}
        <div style={ {padding: 10, fontSize: 20} }>TOTAL: {this.getCartTotal()} </div>
      </div>
    );
  }
}

export default App;
