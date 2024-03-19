import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
function SearchFlight() {
  const [searchedData, setSearchedData] = useState(
    {
      originLocationCode: '',
      destinationLocationCode: '',
      departureDate: '',
      adults: ''
    }
  )
  const [others, setOther] = useState([])
  const [values, setValues] = useState()
  const [keyword, setKeyword] = useState('IND'); // Default keyword
  const [data, setData] = useState()
  useEffect(() => {

  }, [])


  const OnChangeSErchedData = (e) => {
    const { name, value } = e.target
    if (name == 'originLocationCode') {
      setSearchedData({ ...searchedData, [name]: value })

    } else if (name == 'destinationLocationCode') {
      setSearchedData({ ...searchedData, [name]: value })
    } else {
      setSearchedData({ ...searchedData, [name]: value })
    }
  };


  // Function to handle keyup event in the input field
  const onKeyUp = async (event) => {
    console.log('event: ', event);
    const data = event.target.value
    // await handleSearch(data);
    if (event.key === 'Enter') {
      await handleSearch(data);
    }
  };


  const handleSearch = (dataget) => {
    console.log('data==handlesubmit: ', dataget);
    axios.post('http://localhost:5000/flight-api/search', { dataget })
      .then(res => {
        console.log('res: ', res.data);
        if (data == null) {
          setData(res.data);
        } else {
          setOther(res.data);
        }
      })
      .catch(error => {
        console.error('Error occurred during POST request:', error);
      });
  }


  const getDATA = (dataq) => {
    console.log('dataq: ', dataq);
    const newData = data.filter(ob => {
      return ob.id == dataq
      //  console.log('ob===data: ', ob);

    })
    // console.log('newData: ', newData[0].id);
    setSearchedData(prevState => ({
      ...prevState,
      originLocationCode: newData[0].address.cityCode
    }));
    // console.log('getDATA: ====>caleed');

  }
  const getDATA1 = (dataq1) => {
    console.log('dataq111: ', dataq1);
    const newData = others.filter(ob => {
      // console.log('ob==others: ', ob);
      return ob.id == dataq1

    })
    // console.log('newData: ', newData);
    setSearchedData(prevState => ({
      ...prevState,
      destinationLocationCode: newData[0].address.cityCode
    }));
    // console.log('getDATA===dataq1: ====>caleed');

  }
  const SearchFunction = () => {
    axios.post('http://localhost:5000/flight-api/get-flight', searchedData).then(res => {
      console.log('res: ', res.data.data);

    })
  }
  return (
    <>
      <div className=" bg-light d-flex">
        <h1 className='p-4'> SEARCH FOR FLIGHT</h1>
      </div>
      <div class="row mt-5">
        <form className=' d-flex'>
          <div class="col" >
            <label htmlFor='from'>FROM:</label>
            <input placeholder='FROM' className="form-control" onKeyUp={onKeyUp} value={searchedData.originLocationCode} name='originLocationCode' onChange={OnChangeSErchedData} style={{ width: "300px", marginLeft: "100px" }} id='from' />
          </div>
          <div class="col" >
            <label htmlFor='to'>TO:</label>
            <input placeholder='TO' className="form-control" value={searchedData.destinationLocationCode} onKeyUp={onKeyUp} name='destinationLocationCode' onChange={OnChangeSErchedData} style={{ width: "300px", marginLeft: "100px" }} id='to' />
          </div>
          <div class="col" >
            <label htmlFor='date'>DATE:</label>
            <input type='date' placeholder='DATE' className="form-control" value={searchedData.departureDate} name='departureDate' onChange={OnChangeSErchedData} style={{ width: "300px", marginLeft: "100px" }} id='date' />
          </div>
          <div class="col" >
            <label htmlFor='adult'>PASSENGERS:</label>
            <input type='number' placeholder='ADD PASSENGERS' className="form-control" value={searchedData.adults} name='adults' onChange={OnChangeSErchedData} style={{ width: "300px", marginLeft: "100px" }} id='adult' />
          </div>
          <div class="col" >
            <Link className='btn btn-info mt-4' onClick={SearchFunction}>SEARCH</Link>
          </div>
        </form>




      </div>
      <div className='d-flex'>
        {/* first-div */}
        <div className='' style={{ width: "300px", marginLeft: "60px" }}>

          {data?.map(obj =>
            <div onClick={() => getDATA(obj.id)}>
              <li className='' style={{ listStyleType: "none" }} >{obj.iataCode}<span>:{obj.name}</span></li>
            </div>

          )
          }
        </div>

        {/* second */}
        <div className='' style={{ width: "300px", marginLeft: "60px" }}>

          {others?.map(obj =>
            <div onClick={() => getDATA1(obj.id)}>
              <li className='' style={{ listStyleType: "none" }} >{obj.iataCode}<span>:{obj.name}</span></li>
            </div>

          )
          }
        </div>
      </div>

    </>
  )
}

export default SearchFlight