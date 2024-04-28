import React, {useState, useEffect} from 'react'
import axios from 'axios'
//import "./style/App.sass"
import "./style/App1.css"

const App = () => {

  const [data, setData] = useState([])
  const [name, setName] = useState("")
  const [idEdit, setIdEdit] = useState("")
  const [statusEdit, setStatusEdit] = useState("")
  const [isEdit, setIsEdit] = useState()
  const [editedName, setEditedName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(null);

  const startEditing = (id, name) => {
    setIdEdit(id);
    setEditedName(name);
    setIsEditing(true);
  };
  

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
  const onEditName = async() => {
    await axios.put(`http://localhost:8080/api/todo/${idEdit}`,{
      name: editedName
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

  const toggleCompleted = (status) => {
    if (status === 'all') {
      setShowCompleted(null);
    } else if (status === 'active') {
      setShowCompleted(false);
    } else if (status === 'completed') {
      setShowCompleted(true);
    }
  };

  var aktif = 'rgb(221 173 43 / 80%)'
  var tidakAktif = 'rgb(221 173 43  / 20%)'

  

  return (
    <div className='container'>
      <div className='content'>
        <h2>Whats the Plan for today ..?</h2>
        
        <form className='form' onSubmit={AddTodo}>
          <input 
            className='input'
            placeholder='Input Todo List Here' 
            onChange={(e)=> setName(e.target.value)}
            value={name}
          />
          <button className='button' >Submit</button>
        </form>

        <div className='filter'>
          <button className='button' style={{backgroundColor : showCompleted != null ? aktif : tidakAktif}} onClick={() => toggleCompleted('all')}>All</button>
          <button className='button' style={{backgroundColor : showCompleted != false ? aktif : tidakAktif}} onClick={() => toggleCompleted('active')}>Active</button>
          <button className='button' style={{backgroundColor : showCompleted != true ? aktif : tidakAktif}} onClick={() => toggleCompleted('completed')}>Completed</button>
        </div>

        {data.filter(item => {
  if (showCompleted === null) {
    return true; // Tampilkan semua
  } else if (showCompleted === true) {
    return item.status === true; // Tampilkan yang selesai
  } else {
    return item.status === false; // Tampilkan yang belum selesai
  }
}).map((item, i) => (
  <div key={i} className='list'>
    {isEditing && idEdit === item.id ? (
      <div className='data'>
        <input 
          className='input' 
          type='text' 
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      </div>
    ) : (
      <div className='data'>
        <input 
          className='checkbox' 
          type='checkbox' 
          checked={item.status}
          onClick={() => {
            editStatus();
            setIdEdit(item.id);
            setStatusEdit(!item.status);
          }}
        />
        <h4 className={item.status ? "checked": "unchecked"}>{item.name}</h4>
      </div>
    )}
    {isEditing && idEdit == item.id ? 
    <div className='action'>
      <button 
          className='button_child'
          style={{ backgroundColor : 'rgb(224 148 37 / 80%)'}}
          onClick={() => {
            onEditName();
            setIsEditing(false);
          }}
        >
          Submit
        </button>
        <button 
          className='button_child'
          onClick={() => {
            setIsEditing(false);
            getData();
          }}
        >
          Cancel
        </button>
    </div>
    : <div className='action'>
      <button 
        className='button_child' 
        style={{ backgroundColor : 'rgb(224 148 37 / 80%)'}}
        onClick={() => startEditing(item.id, item.name)}
      >
        Edit
      </button>
      <button 
        className='dangerous'
        onClick={() => onDelete(item.id)}
      >
        Delete
      </button>
    </div> }
  </div>
))}


      </div>
    </div>
  )
}

export default App