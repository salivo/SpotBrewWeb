
import can1 from './static/imgs/can1.png';

function HomePage(pros){ // args: [products, product_onchoose]
    if (typeof pros.products === 'undefined'){
        return(<p>Loading...</p>)
    }
    if (pros.products.length === 0){
        return(<p>Loading...</p>)
    }
    return(
        <div className="HomeMain">
            <div className="ProductsContainer" key="product_container">
                {pros.products.map((product) => (
                    <Product
                        key={product.id}
                        info={product} 
                        onChoose={pros.onChoose}
                        func_args = {pros.func_args}
                    />
                ))}
            </div>
        </div>
    )
}

function Product(pros){ // args: [product, onChoose]
    return(
        <div className="productCard" key={pros.info.id}>
            <img src={can1} alt={pros.info.desc}></img>
            <div>
                <h1>{pros.info.name}</h1>
                <h2>{pros.info.desc}</h2>
                <h3>{pros.info.price},-</h3>
                <button onClick={() => {pros.onChoose(pros.info.id, pros.func_args)}}>Buy</button>
            </div>
        </div>
    );
}

export default HomePage