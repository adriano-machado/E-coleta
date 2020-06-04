import React, {useEffect, useState, ChangeEvent, FormEvent} from "react"
import {Link, useHistory} from "react-router-dom"
import {FiArrowLeft} from "react-icons/fi"
import axios from "axios"

import {Map, TileLayer, Marker} from "react-leaflet"
import {LeafletMouseEvent} from "leaflet"

import "./styles.css"
import logo from "../../assets/logo.svg"
import api from "../../services/api"

interface Item {
  id:number;
  title:string;
  image_url: string;
}

interface IbgeUfResponse {
  sigla:string
}
interface IbgeCityResponse {
  nome:string
}

const CreatePoint : React.FC = ( ) => {
  const history = useHistory()
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUFS] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name:"",
    email:"",
    whatsapp:"",
  })

  const [selectedItems, setSeletedItems] = useState<number[]>([])
  const [ selectedUF, setSelectedUF] = useState("0")
  const [ selectedCity, setSelectedCity] = useState("0")
  const [ initialPosition, setInitialPosition] = useState<[number,number]>([0,0])

  const [ selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0])

useEffect(() => {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude,longitude} = position.coords
    setInitialPosition([latitude,longitude])

  }
  )
},[])
  useEffect(() => {
      async function getItems() {
        const response = await api.get('items')
          setItems(response.data)
      } 

      getItems()
  },[])

  useEffect(() => {
    async function getUfs() {
      const response = await axios.get<IbgeUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        const ufInitials = response.data.map(uf => uf.sigla)
        setUFS(ufInitials)
    } 

    getUfs()
},[])

useEffect(() => {
    async function getCities() {
      if(selectedUF === "0") {
        return; 
      }

      const response = await axios.get<IbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      const ufInitials = response.data.map(uf => uf.nome)
      setCities(ufInitials)
    }

    getCities()
},[selectedUF])

function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
 setSelectedUF(event.target.value)
}

function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
  setSelectedCity(event.target.value)
 }
 function handleMapClick(event : LeafletMouseEvent) {
  setSelectedPosition([event.latlng.lat,event.latlng.lng])

 }

 function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
  const {name,value} = event.target
  setFormData({...formData, [name]: value})

 }

 function handleSelectItem(id :number) {
  const findIndex = selectedItems.findIndex(item => item === id)

  if(findIndex >=0 ) {
    const filteredItens = selectedItems.filter(item => item !== id)
    setSeletedItems(filteredItens)
    
  } else {
    setSeletedItems([...selectedItems,id])

  }

 }

 async function handleSubmit(e : FormEvent) {
   e.preventDefault()
   console.log('entrei')
   const {name,email,whatsapp} = formData
   const uf = selectedUF
   const city = selectedCity
   const [latitude,longitude] = selectedPosition
   const items = selectedItems
   const data = {
     name,
     email,
     whatsapp,
     uf,
     city,
     latitude,
     longitude,
     items
   }
   const response = await api.post('/points',data)
   history.push("/")
   console.log(response)
 }


  return (
     <div id="page-create-point">
       <header>
         <img src={logo} alt="E-Coleta"></img>
         <Link to="/">
           <FiArrowLeft></FiArrowLeft>
           Voltar para home
         </Link>
       </header>
       <form onSubmit={handleSubmit}>
         <h1>Cadastro do <br/> ponto de coleta</h1>
         <fieldset>
           <legend>
             <h2>Dados</h2>
           </legend>

           <div className="field">
             <label htmlFor="email">Email</label>
             <input
                   type="email"
                   name="email"
                   id="email"
                   onChange={handleInputChange}
              >
             
             </input>
           </div>

           <div className="field-group">
           <div className="field">
             <label htmlFor="name">Nome da entidade</label>
             <input
                   type="text"
                   name="name"
                   id="name"
                   onChange={handleInputChange}

              >
             
             </input>
           </div>

           <div className="field">
             <label htmlFor="whatsapp">Whatsapp</label>
             <input
                   type="text"
                   name="whatsapp"
                   id="whatsapp"
                   onChange={handleInputChange}

              >
             
             </input>
           </div>


           </div>
         </fieldset>
         <fieldset>
           <legend>
             <h2>Endereço</h2>
             <span>Selecione o endereço no mapa</span>
           </legend>

      <Map center={initialPosition} zoom={15} onClick={handleMapClick}> 
      <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={selectedPosition}></Marker>
      </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUF}>
                  <option value="0"> Selecione uma UF</option>
                  {ufs.map(uf => (
                <option key={uf} value={uf}>{uf}</option>

                  ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select value={selectedCity}  name="city" id="city"  onChange={handleSelectCity}>
                {cities.map(city => ( <option key={city} value={city}>{city}</option>))}
                  <option value="0"> Selecione uma cidade</option>
              </select>
            </div>

          </div>

         </fieldset>


         <fieldset>
           <legend>
             <h2>Itens de coleta</h2>
             <span>Selecione um ou mais itens abaixo</span>

           </legend>
           <ul className="items-grid">

             {items.map(item => (
                            <li key={String(item.id)} className={selectedItems.includes(item.id)? "selected": ""} onClick={() => handleSelectItem(item.id)}>
                            <img src={item.image_url} alt={item.title}></img>
             <span>{item.title}</span>
                          </li>  
             ))}
           </ul>
         </fieldset>

         <button type="submit">Cadastrar ponto de coleta</button>
       </form>
     </div>
  )

}

export default CreatePoint