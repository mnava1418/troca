import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'

function Portfolio () {
    return(
        <section className='full-screen d-flex flex-column justify-content-start align-items-center'>
            <div className='dark-container form-container form-container-dark' style={{width: '90%', margin: '24px 0px 24px 0px'}}>
                <Form>
                    <div className='d-flex justify-content-end align-items-center search-bar'>
                        <InputGroup style={{marginRight: '0px'}}>
                            <Form.Select>
                                <option>Sort by</option>
                                <option>Top Price</option>
                                <option>Low Price</option>
                                <option>Newest</option>
                                <option>Oldest</option>
                            </Form.Select>
                        </InputGroup>
                        <InputGroup className='search-bar-input'>
                            <Form.Control type="text" placeholder="address, author or title." />
                            <InputGroup.Text><i className='bi bi-search' /></InputGroup.Text>
                        </InputGroup>
                    </div>
                </Form>
            </div>
            <div style={{width: '90%', backgroundColor: 'red'}}>Contenido</div>
        </section>
    )
}

export default Portfolio
