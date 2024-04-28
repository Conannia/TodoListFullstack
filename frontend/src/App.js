import React, {useState, useEffect} from 'react'
import axios from 'axios'
//import "./style/App.sass"
import "./style/App1.css"

const App = () => {

  const [data, setData] = useState([])
  const [name, setName] = useState("")
  const [idEdit, setIdEdit] = useState("")
  const [statusEdit, setStatusEdit] = useState("")

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    await axios.get('http://localhost:8080/api/todo')
    .then(res => {
      console.log(res.data)
      setData(res.data.data.sort((a,z)=> a.name.localeCompare()))
    })
    .catch(err => {
      console.log(err)
    })
  }

  const AddTodo = async(e) => {
    e.preventDefault()
    await axios.post('http://localhost:8080/api/todo',{
      name: name,
      status: false
    })
    .then(result => {
      getData()
      setName('');
    })
    .catch(err => {
      console.log(err)
    })

  }

  

  const editStatus = async() => {
    await axios.put(`http://localhost:8080/api/todo/${idEdit}`,{
      status: statusEdit
    })
    .then(res => {
      console.log(res.data)
      getData()
    })
    .catch(err => {
      console.log(err)
    })
  }
  const onDelete = async(id) => {
    await axios.delete("http://localhost:8080/api/todo/" + id)
    .then(res => {
      console.log(res.data.message)
      alert(res.data.message)
      getData()
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <div className='container'>
      <div className='content'>
        <form className='form' onSubmit={AddTodo}>
          <input 
            className='input'
            placeholder='Input Todo List Here' 
            onChange={(e)=> setName(e.target.value)}
            value={name}
          />
          <button className='button' >Submit</button>
        </form>
        {data.map((item, i) => (
          <>
            <div key={i} className='list'>
              <h4 className={item.status ? "checked": "unchecked"}>{item.name}</h4>
              <div className='action'>
                <input 
                  className='checkbox' 
                  type='checkbox' 
                  checked={item.status}
                  onClick={()=> {
                    editStatus()
                    setIdEdit(item.id)
                    setStatusEdit(!item.status)
                  }}
                />
                <button 
                className='dangerous'
                onClick={()=>
                  onDelete(item.id)
                
                }
                  
                >Delete</button>
                </div>
            </div>
          </>
        ))}

      </div>
    </div>
  )
}

export default App