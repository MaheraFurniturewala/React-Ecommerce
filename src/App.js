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
      .orderBy('price','desc')
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
    //instead of increasing quantity in state increase it in firebase cause that would also increase in state and ui
    // products[index].qty += 1;
    // this.setState({
    //   products
    // })
    //we get reference of the product whose quantity is changed
    const docRef = this.db.collection('products').doc(products[index].id);
    docRef
       .update({
         qty:products[index].qty + 1,
       })
       .then(()=>{
         console.log('doc updated successfully');
       })
       .catch((error)=>{
         console.log("Error : ", error);
       })



  }
  handleDecreaseQuantity = (product) => {
    const { products } = this.state;
    const index = products.indexOf(product);

    if (products[index].qty === 0) {
      return;
    }

    // products[index].qty -= 1;

    // this.setState({
    //   products
    // })


    const docRef = this.db.collection('products').doc(products[index].id);
    docRef
       .update({
         qty:products[index].qty - 1,
       })
       .then(()=>{
         console.log('doc updated successfully');
       })
       .catch((error)=>{
         console.log("Error : ", error);
       })
  }

  handleDeleteProduct = (id) => {
    const { products } = this.state;
    

    const items = products.filter((item) => item.id !== id); // [{}]
    const docRef = this.db.collection('products').doc(id);
    // this.setState({
    //   products: items
    // })

    docRef
      .delete()
      .then(()=>{
        console.log("Deleted cart item successfully");
      })
      .catch((error)=>{
        console.log("Error : ",error);
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
        {/* <button style={{padding:20, fontSize:20}} onClick={this.addProduct}>Add a product</button> */}
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


//use .where for conditional querying 