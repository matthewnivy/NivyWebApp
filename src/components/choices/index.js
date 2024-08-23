import './style.scss'
import { useContext, useEffect, useState } from 'react'
import ApplicationContext from '../../utills/context-api/context'

export function Choices({
  nametype,
  nameGroup,
  array,
  selectedOptions,
  updatePrice,
}) {
  const [data, setData] = useState(array)
  const { setItemOptions, edit } = useContext(ApplicationContext)
  useEffect(() => {
    if (selectedOptions) {
      normalizedData()
    } else {
      InitialSettingOption()
    }
    if (edit) {
      setItemOptions('')
    }
  }, [])

  const normalizedData = () => {
    let temp = [...data]
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < selectedOptions.length; j++) {
        temp[i].selected =
          temp[i].optionChoiceName === selectedOptions[j].optionChoiceName
      }
    }
    setData(temp)
    updatePrice(nametype, temp)
  }

  const InitialSettingOption = () => {
    let temp = [...data]
    let count = 0
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].outOfStock == false) {
        temp[i].selected = i === count
      } else {
        count++
        if (temp[count].outOfStock == false) {
          temp[i].selected = i === count
        }
      }
    }
    setData(temp)
    updatePrice(nametype, temp)
  }

  return (
    <div className={'mainBox'}>
      <p className={'types'}>{nametype}</p>
      <section className={'checkDiv'}>
        {data.map((item, index) => (
          <div>
            <input
              disabled={item.outOfStock}
              type='radio'
              name={nameGroup}
              value={item.optionChoiceName}
              checked={item.selected}
              className='radiobutton'
              onChange={(e) => {
                if (e.target.checked) {
                  let temp = [...data]
                  for (let i = 0; i < temp.length; i++) {
                    temp[i].selected = i === index
                  }
                  setData(temp)
                  updatePrice(nametype, temp)
                }
              }}
            />
            <span
              className={item.outOfStock ? 'labelStyles strike' : 'labelStyles'}
            >
              {item.optionChoiceName}
              {item.price != 0 ? ' ( $' + item.price + ' )' : null}
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}
