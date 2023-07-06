import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Table from 'react-bootstrap/Table'
import Pagination from 'react-bootstrap/Pagination'

import { PATHS } from '../config'
import { connectionStatusSelector } from '../store/slices/statusSlice'
import { orderBookSelector, showExchange } from '../store/slices/exchangeSlice'
import { parseAccount } from '../services/ethServices'

function OrderBook () {
    const { isConnected } = useSelector(connectionStatusSelector)
    const orderBook = useSelector(orderBookSelector)
    const [selectedPage, setSelectedPage] = useState(0)
    const dispatch = useDispatch()

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } 
        // eslint-disable-next-line
    }, [isConnected])

    const showEmptyOrderBook = () => {
        return (
            <div className='d-flex flex-column justify-content-center align-items-center' style={{width: '90%'}}>
                <h4 style={{margin: '0px 0px 24px 0px'}}>We weren't able to find orders.</h4>
                <i className="bi bi-emoji-frown" style={{fontSize: '100px', color: 'var(--secondary-color)'}}></i>        
            </div>
        )
    }

    const getPagination = () => {
        const pages = Math.ceil(orderBook.length / 10 )

        return(
            <div className='d-flex flex-row justify-content-center align-items-center' style={{width: '100%'}}>
                <Pagination>
                    <Pagination.First onClick={() => {setSelectedPage(0)}}/>
                    <Pagination.Prev onClick={() => {selectedPage > 0 ? setSelectedPage(selectedPage - 1) : <></>}}/>
                    {[...Array(pages)].map((x, i) => {
                        return(<Pagination.Item key={`${x}${i}`} active={i === selectedPage} onClick={() => {setSelectedPage(i)}}>{i + 1}</Pagination.Item>)
                    })}
                    <Pagination.Next onClick={() => {selectedPage < pages - 1 ? setSelectedPage(selectedPage + 1) : <></>}}/>
                    <Pagination.Last onClick={() => {setSelectedPage(pages - 1)}}/>
                </Pagination>
            </div>
        )
    }

    const showOrderBook = () => {
        return (
            <div style={{width: '90%', overflow: 'auto'}}>
                <Table responsive striped hover style={{marginTop: '24px'}}>
                    <thead>
                    <tr>
                        <th>Order Id</th>
                        <th>Order Date (dd/mm/yyyy)</th>
                        <th>Buyer</th>
                        <th>Buyer Token Id</th>
                        <th>Seller</th>
                        <th>Seller Token Id</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                        {orderBook.slice(selectedPage * 10, selectedPage * 10 + 10).map((order, index) => {
                            const orderDate = new Date(order.id)
                            return(
                                <tr key={index} style={{cursor: 'pointer'}} onClick={() => {dispatch(showExchange({show: true, order}))}}>
                                    <td>{order.id}</td>
                                    <td>{`${orderDate.getDate()}/${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`}</td>
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
                {getPagination()}
            </div>
        )
       
    }

    return(
        <section className='full-screen d-flex flex-column justify-content-center align-items-center'>
            {orderBook.length > 0 ? showOrderBook() : showEmptyOrderBook()}
        </section>
    )
}

export default OrderBook