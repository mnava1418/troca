import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table'

import { PATHS } from '../config'
import { connectionStatusSelector } from '../store/slices/statusSlice'
import { orderBookSelector } from '../store/slices/exchangeSlice'
import { parseAccount } from '../services/ethServices'

function OrderBook () {
    const { isConnected } = useSelector(connectionStatusSelector)
    const orderBook = useSelector(orderBookSelector)

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } 
        // eslint-disable-next-line
    }, [isConnected])

    const showEmptyOrderBook = () => {
        return (
            <div className='d-flex flex-column justify-content-center align-items-center fixed-container' style={{width: '90%'}}>
                <h4 style={{margin: '100px 0px 24px 0px'}}>We weren't able to find orders.</h4>
                <i className="bi bi-emoji-frown" style={{fontSize: '100px', color: 'var(--secondary-color)'}}></i>        
            </div>
        )
    }

    const showOrderBook = () => {
        return (
            <div style={{width: '90%', overflow: 'auto'}}>
                <Table responsive striped bordered hover variant="dark" style={{marginTop: '24px'}}>
                    <thead>
                    <tr>
                        <th>Order Id</th>
                        <th>Buyer</th>
                        <th>Buyer Token Id</th>
                        <th>Seller</th>
                        <th>Seller Token Id</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                        {orderBook.map((order, index) => {
                            return(
                                <tr key={index}>
                                    <td>{order.id}</td>
                                    <td>{parseAccount(order.buyer)}</td>
                                    <td>{order.buyerTokenId}</td>
                                    <td>{parseAccount(order.seller)}</td>
                                    <td>{order.sellerTokenId}</td>
                                    <td>{order.price}</td>
                                    <td>{order.status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        )
       
    }

    return(
        <section className='full-screen d-flex flex-column justify-content-start align-items-center'>
            {orderBook.length > 0 ? showOrderBook() : showEmptyOrderBook()}
        </section>
    )
}

export default OrderBook