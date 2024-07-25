import React, { KeyboardEvent, SyntheticEvent, useEffect, useState } from 'react'


import {ApiResponse, FeatureMember, GeoObject} from './enter-address-types'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import clsx from 'clsx'

import s from './enter-address.module.css'
import {Map, Placemark, YMaps} from "react-yandex-maps";

const center = [55.4424, 37.3636]

export const API_KEY = '2fb34dcc-abec-4a20-8c3b-2b663d3912ca'

type dataType = {
  currentAddress: string
  currentCoords: number[]
}

type Props = {
  onSendCoords: (data: dataType) => void
}
export const EnterAddressForm = ({ onSendCoords }: Props) => {
  const [value, setValue] = useState<string>('')
  const [options,setOptions] = useState<GeoObject[]>([])
  const [currentCoords, setCurrentCoords] = useState<number[] | undefined>()
  const [newCoords, setNewCoords] = useState<number[]>([])
  const [currentAddress, setCurrentAddress] = useState<string>('')

  const classNames = {
    autocomplete: clsx(s.autocomplete),
    map: clsx(s.map),
    submitButton: clsx(s.submitButton),
    textField: clsx(s.textField),
  }

  useEffect(() => {
    const fetchGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords

            setCurrentCoords([latitude, longitude])
          },
          error => {
            console.log(error)
          }
        )
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    }

    fetchGeolocation()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        if (value) {
          const res = await fetch(
              `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&format=json&geocode=${value}`
          )
          const data = await res.json()
          const collection = data.response.GeoObjectCollection.featureMember.map(
              (item: FeatureMember) => item.GeoObject
          )

          setOptions(collection)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [value])


  useEffect(() => {
    ;(async () => {
      try {
        if (currentCoords) {
          const res = await fetch(
            `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&format=json&geocode=${currentCoords[1]},${currentCoords[0]}`
          )
          const data: ApiResponse = await res.json()
          const collection = data.response.GeoObjectCollection.featureMember

          if (collection.length > 0) {
            const firstItem = collection[0].GeoObject
            const address = firstItem.metaDataProperty.GeocoderMetaData.text

            setCurrentAddress(address)
          }
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [currentCoords])

  const handleAutocompleteChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: null | string
  ) => {
    if (typeof newValue === 'string') {
      const obj = options.find(
        (item: any) => newValue.includes(item.name) && newValue.includes(item.description)
      )
      const coords = obj?.Point.pos
        .split(' ')
        .map((item: any) => Number(item))
        .reverse()

      setCurrentCoords(coords)
      setValue(newValue)
    }
  }

  const handleInputChange = (event: SyntheticEvent<Element, Event>) => {
    if (event) {
      const enteredAddress = (event.target as HTMLInputElement).value

      setValue(enteredAddress)
      ;(async () => {
        try {
          const res = await fetch(
            `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&format=json&geocode=${enteredAddress}`
          )
          const data: ApiResponse = await res.json()
          const collection = data.response.GeoObjectCollection.featureMember

          if (collection.length > 0) {
            const firstItem = collection[0].GeoObject
            const coords = firstItem.Point.pos
              .split(' ')
              .map((item: any) => Number(item))
              .reverse()

            setNewCoords(coords)
          }
        } catch (e) {
          console.log(e)
        }
      })()
    }
  }

  const onKeyDownAutocomplete = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setCurrentCoords(newCoords)
    }
  }

  const onHandler = () => {
    if (currentCoords && currentAddress) {
      const data = { currentAddress, currentCoords }

      onSendCoords(data)
    }
  }

  return (
    <>
      <YMaps
        query={{
          apikey: API_KEY,
          load: 'package.full',
        }}
      >
        <Autocomplete
          className={s.autocomplete}
          filterOptions={x => x}
          freeSolo
          onChange={handleAutocompleteChange}
          onInputChange={handleInputChange}
          onKeyDown={onKeyDownAutocomplete}
          options={options.map(item => `${item.name} ${item.description}`)}
          renderInput={params => (
            <div>
              <div>Ваш или ближайший к вам адрес где вы ищете сиделку </div>
              <TextField {...params} className={classNames.textField} label={'Введите адрес'} />
            </div>
          )}
          value={currentAddress}
        />
        <Map
          className={classNames.map}
          state={{
            center: currentCoords || center,
            zoom: 9,
          }}
        >
          {currentCoords && (
            <Placemark geometry={currentCoords} options={{ preset: 'islands#redCircleDotIcon' }} />
          )}
          {newCoords.length > 0 && (
            <Placemark geometry={newCoords} options={{ preset: 'islands#blueCircleDotIcon' }} />
          )}
        </Map>
      </YMaps>
      <button className={classNames.submitButton}
        disabled={currentCoords === undefined}
        onClick={onHandler}
      >
        Далее
      </button>
    </>
  )
}
