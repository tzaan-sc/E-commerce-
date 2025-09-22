import { useState, useEffect } from "react"
import ProductCard from "./components/products/ProductCard";
// function App() {
//   const [counter, setCounter]=useState(1)

//   const handleIncrease = () => {
//     setCounter(counter+1)

//   }
//   return (
//     <div className="App" style={{padding: 20}}>
//       <h1>{counter}</h1>
//       <button onClick={handleIncrease}>Increase</button>

//     </div>
//   );
// }

function App(){
  // const [title, setTitle]=useState('')

  // useEffect(() => {
  //   console.log('Mounted')
  // })

return (
  //   <div>
  //     <input
  //       value={title}
  //       onChange={e => setTitle(e.target.value)}
  //     />
  //   </div>
<div>
      <ProductCard />   {/* gọi component để hiển thị */}
    </div>
);

  
}
export default App;
