import React from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import ReactDOM from 'react-dom/client'
import logo from './assets/fulllogo.png'
import shoppingcart from './assets/shoppingcart.svg'
import toast, {Toaster} from "react-hot-toast"
import { DotLoader } from "react-spinners"
import './index.css'
import { v4 as uuidv4 } from 'uuid';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const groceries = [
  {id: uuidv4(), title: "Milk", imageUrl: 'milk.jpg', price: 2000},
  {id: uuidv4(), title: "Bread", imageUrl: 'bread.jpg', price: 3500},
  {id: uuidv4(), title: "Eggs", imageUrl: 'tray_of_eggs.jpg', price: 4000},
  {id: uuidv4(), title: "Apples", imageUrl: 'apple.jpg', price: 12000},
  {id: uuidv4(), title: "Bananas", imageUrl: 'bananas.jpg', price: 2000},
  {id: uuidv4(), title: "BlueBand", imageUrl: 'blueband.jpg', price: 4000},
  {id: uuidv4(), title: "Chicken", imageUrl: 'chicken.jpg', price: 3000},
  {id: uuidv4(), title: "Beef", imageUrl: 'beef.jpg', price: 25000},
  {id: uuidv4(), title: "Fish", imageUrl: 'fish.jpg', price: 12000},
  {id: uuidv4(), title: "Carrots", imageUrl: 'carrots.jpg', price: 10000},
  {id: uuidv4(), title: "Tomatoes", imageUrl: 'tomatoes.jpg', price: 2000},
  {id: uuidv4(), title: "Potatoes", imageUrl: 'potatoes.jpg', price: 6000},
  {id: uuidv4(), title: "Onions", imageUrl: 'onions.jpg', price: 3000},
  {id: uuidv4(), title: "Lettuce", imageUrl: 'lettuce.jpg', price: 4000},
  {id: uuidv4(), title: "Cucumbers", imageUrl: 'cucumbers.jpg', price: 4500}

]

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path:'products/',
        element: <Products/>
      },
      {
        path: 'cart/',
        element: <Cart/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)

function Home(){
  return(
  <div className="home">
      <div className="gallery">
          <div className="overlay">
              <h1 className="welcome-heading">Welcome to Ian's Shop</h1>
              <p>What could you be interested in?</p>
              <div className="choices">
                  <Link className="bg-dark home-link" to={'/products'}>All Products</Link>
              </div>
          </div>
      </div>
      
  </div>
  )
}

function Cart(){
  let [cartItems, setCartItems, totalCost, setTotalCost] = useOutletContext()

  function handleRemoveItem(id){
      setCartItems(cartItems.filter(item => item.id != id))
  }
  
  function handleCountChange(id, cost, count){
      setCartItems(cartItems.map(item => {
          if(item.id == id){
              return {...item, cost, count}
          } else {
              return item;
          }
      }))
  }

  useEffect(() => {
      setTotalCost(cartItems.reduce((total, item) => total + item.cost, 0))
  }, [cartItems])
  
  return(
      (cartItems.length 
      ? 
      <div className='cart'>
          {cartItems.map(item => 
              <CartItem key={item.id} item={item} removeItem={handleRemoveItem} getCost={handleCountChange}/>
          )}
              <p>Your total is ${totalCost.toFixed(2)}</p>
              <button className="bg-dark checkoutbtn">Check out!</button>
      </div>
      :
      <div className="emptycart">
          <p>The cart is currently empty. <Link to={'/products'}>Start shopping</Link></p>
      </div>
      )
  )
}

const CartItem = ({item, removeItem, getCost})=>{
  const [count, setCount] = useState(1)
  const [itemCost, setItemCost] = useState(item.price)

  function handleDecrease(){
      setCount(prevCount => {
          getCost(item.id, (prevCount - 1) * item.price, (prevCount - 1))
          setItemCost((prevCount - 1) * item.price)
          return prevCount - 1
      })
  }
  
  function handleIncrease(){
      setCount(prevCount => {
          getCost(item.id, (prevCount + 1) * item.price, (prevCount + 1))
          setItemCost((prevCount + 1) * item.price)
          return prevCount + 1
      })
  }

  useEffect(()=>{
      if(item.count < 1){
          removeItem(item.id)
      }
  }, [count])

  return(
      <div className="cartcard">
          <p className="productprice">${item.price}</p>
          <img style={{width:'100px'}} src={item.imageUrl}/>
          <p>{item.title}</p>
          <div className="cartItemBottom">
              <button className='btn' onClick={handleDecrease}>-</button>
              {item.count}
              <button className='btn' onClick={handleIncrease}>+</button>
          </div>
          <span>{(item.count * item.price).toFixed(2)}</span>
      </div>
  )
}

function ProductCard({id, title, imageUrl, price}){
  const [cartItems, setCartItems] = useOutletContext()

  function handleClick(title, price){
     if(cartItems.filter(item => item.title == title).length){
      toast('Item is already in cart')
     } else {
      setCartItems([...cartItems, {id, title, imageUrl, price, cost:price, count:1}])
      toast(`${title} Added to Cart`)
     }
  }
  return(
      <div className="card">
          <p className="bg-dark">shs. {price}</p>
          <img style={{width:'100px'}} src={getImageUrl(imageUrl)} alt={title}/>
          <p>{title}</p>
          <div className="cardbottom">
              <button className="addbtn" onClick={()=>handleClick(title, price)}>Add to Cart</button>
              <Toaster/>
          </div>
      </div>
  )
}

function Products(){
  const [products, setProducts] = useState([])
  const [displayProducts, setDisplayProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  useEffect(()=>{
      setTimeout(()=>{
          setProducts(groceries)
          setLoading(false)
      }, 1000)
  }, [])

  useEffect(()=>{
     return setDisplayProducts(products.filter(product => product.title.toLowerCase().includes(search.toLowerCase())))
  }, [search])
  
  return(
      <div>
          <div className="container">
              <input onChange={(e)=>setSearch(e.target.value)} className="searchInput" placeholder="Search Products"/>
          </div>
          {loading 
          ? 
          <div className="loader">
              <DotLoader size={'100px'}/>
          </div>
          : 
          <div className='allproductscontent'>
              { search.length == 0 ? products.map(product =>
                  <ProductCard key={product.id} id={product.id} title={product.title} imageUrl={product.imageUrl} price={product.price} category={product.category}/>
              ) : displayProducts.map(product => <ProductCard key={product.id} id={product.id} title={product.title} imageUrl={product.image} price={product.price} category={product.category}/>
              )}
          </div>}
      </div>
  )
}
function Root() {
  const [cartItems, setCartItems] = useState([])
  const [totalCost, setTotalCost] = useState(0)

  return(
    <div className='root'>
        <div className="sidebar">
            <div>
              <img className="logo" src={logo}/>
              <ul className='links'>
                <li><NavLink className={({ isActive }) =>
                      isActive
                        ? "bg-dark"
                        : ""
                    }to={'/'} ><i className="bi bi-house"></i> Home</NavLink>
                </li>
                <li><NavLink className={({ isActive }) =>
                      isActive
                        ? "bg-dark"
                        : ""
                    } to={'/products'}><i className="bi bi-bag"></i> All Products</NavLink>
                </li>
              </ul>
            </div>
        </div>
        <Outlet context={[cartItems, setCartItems, totalCost, setTotalCost]}/>
      <div className='cartsidebar'>
        <span className='cartcount'>{cartItems.length}</span><Link to={'/cart'}><img className='icon' src={shoppingcart}/></Link>
      </div>
    </div>
  )
}
function getImageUrl(name){
  return new URL(`./assets/${name}`, import.meta.url).href
}