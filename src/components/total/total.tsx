import { FC } from 'react'
import styles from './total.module.css'

// TODO: move to utils
const convertValue = (value?: number, isEuro = true) => {
  const stringValue = value.toString()
  return isEuro
    ? `€${stringValue.slice(0, stringValue.length - 2)}.${stringValue.slice(
        stringValue.length - 2
      )}`
    : `${stringValue} m`
}

type Keys = 'total' | 'cart' | 'deliveryFee' | 'distance' | 'smallOrderSurcharge'

const titles: Record<Keys, string> = {
  total: 'Total price',
  deliveryFee: 'Delivery fee',
  distance: 'Delivery distance',
  smallOrderSurcharge: 'Small order surcharge',
  cart: 'Cart value'
}

export const Total: FC<Record<Keys, number | null | undefined>> = data => {
  return (
    <section className={styles.Total}>
      <span className={styles.Title}>Prices in EUR</span>

      <dl className={styles.Items}>
        {Object.entries(data).map(([item, value]) => {
          if (typeof value !== 'number') return
          return (
            <div key={item} className={styles.Item}>
              <dt className={styles.ItemTitle}>{titles[item as Keys]}</dt>
              <dd className={styles.ItemValue}>{convertValue(value)}</dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
