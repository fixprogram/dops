import { FC } from 'react'
import styles from './total.module.css'
import { convertCentsToEuros } from '../../utils/convertCentsToEuros'

type Keys = 'cart' | 'deliveryFee' | 'smallOrderSurcharge'

const titles: Record<Keys, string> = {
  deliveryFee: 'Delivery',
  smallOrderSurcharge: 'Small order surcharge',
  cart: 'Cart value'
}

interface TotalPropsType {
  data: Record<Keys, number | null | undefined>
  distance: number | null
}

export const Total: FC<TotalPropsType> = ({ data, distance }) => {
  const formattedData = Object.entries(data)
    .filter(([, value]) => typeof value === 'number')
    .map(item => ({ key: item[0] as Keys, value: item[1] as number }))

  const total = formattedData.reduce((acc, { value }) => acc + value, 0)

  return (
    <section className={styles.Total}>
      <span className={styles.Title}>
        Prices in EUR
        <span className={styles.Subtitle}>Fill the form to see total</span>
      </span>

      <dl className={styles.Items}>
        {formattedData.map(({ key, value }) => (
          <div key={key} className={styles.Item}>
            <dt className={styles.ItemTitle}>
              {titles[key]}
              {key === 'deliveryFee' ? `(${distance} m)` : null}
            </dt>
            <dd className={styles.ItemValue}>{convertCentsToEuros(value)}</dd>
          </div>
        ))}

        {total ? (
          <div key={'total'} className={styles.Item}>
            <dt className={styles.ItemTitle}>Total</dt>
            <dd className={styles.ItemValue}>{convertCentsToEuros(total)}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  )
}
