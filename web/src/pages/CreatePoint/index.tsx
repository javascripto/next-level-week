import { LeafletMouseEvent } from 'leaflet';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';

import './styles.css';
import logo from '../../assets/logo.svg';
import { api, IBGELocalidades } from '../../services/api';

interface Item {
  id: number;
  title: string;
  image: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}


const Createpoint = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  const history = useHistory()


  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    IBGELocalidades.get<IBGEUFResponse[]>('/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
      })
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    IBGELocalidades.get<IBGECityResponse[]>(`/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      })
  }, [selectedUf]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords;
      setInitialPosition([latitude, longitude])
    })
  }, []);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(event.target.value)
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  function handleMapClick({ latlng: { lat: latitude, lng: longitude }}: LeafletMouseEvent) {
    setSelectedPosition([ latitude, longitude ]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);
    if (alreadySelected > -1) {
      const filteredSelected = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredSelected);
    } else { 
      setSelectedItems([...selectedItems, id]);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = {
      ...formData,
      items: selectedItems,
      city: selectedCity,
      uf: selectedUf,
      latitude: selectedPosition[0],
      longitude: selectedPosition[1],
     };
     api.post('/points', data)
      .then(() => {
        alert('Ponto de coleta registrado com sucesso');
        history.push('/');
      })
      .catch(() => alert('Erro ao criar ponto de coleta'));
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>
        <Link to="/">
          <FiArrowLeft />
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
            <label htmlFor="name">Nome de entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
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
            {selectedPosition[0] !== 0 && (
              <Marker position={selectedPosition} />
            )}
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}>
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Seelcione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
            <li
              key={item.id}
              onClick={() => handleSelectItem(item.id)}
              className={selectedItems.includes(item.id) ? 'selected' : ''}>
              <img src={item.image} alt={item.title}/>
              <span>{item.title}</span>
            </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
}

export default Createpoint;
